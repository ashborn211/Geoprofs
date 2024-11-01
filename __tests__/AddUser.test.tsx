import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page"; // Ensure the path is correct
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, getDocs } from "firebase/firestore";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

// Mock Firebase functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  createUserWithEmailAndPassword: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
  connectAuthEmulator: jest.fn(),
}));

jest.mock("firebase/firestore", () => {
  const actualFirestore = jest.requireActual("firebase/firestore");
  return {
    ...actualFirestore,
    getFirestore: jest.fn(),
    initializeFirestore: jest.fn(),
    connectFirestoreEmulator: jest.fn(),
    setDoc: jest.fn(() => Promise.resolve()),
    getDocs: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});

// Mock teams data
const mockTeams = [
  { id: "team1", TeamName: "Team One" },
  { id: "team2", TeamName: "Team Two" },
];

(getDocs as jest.Mock).mockImplementation(() => {
  return Promise.resolve({
    docs: mockTeams.map((team) => ({ id: team.id, data: () => team })),
  });
});

describe("AddUser Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates and displays a random password when the "Generate Password" button is clicked', async () => {
    render(<AddUser />);

    const generatePasswordButton = screen.getByText("Generate Password");
    fireEvent.click(generatePasswordButton);

    // Validate that the generated password appears on the screen
    const passwordDisplay = await screen.findByText(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$/
    );
    expect(passwordDisplay).toBeInTheDocument();
  });

  it("adds a new user and stores it in Firestore with a hashed password", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "test-user-id" },
    });

    render(<AddUser />);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText("Enter naam"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /team/i }), {
      target: { value: "team1" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /role/i }), {
      target: { value: "user" },
    });

    // Generate password
    const generatePasswordButton = screen.getByText("Generate Password");
    fireEvent.click(generatePasswordButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$/
        )
      ).toBeInTheDocument();
    });

    // Submit the form using the submit button
    const submitButton = screen.getByRole("button", { name: /add user/i });
    await waitFor(() => fireEvent.click(submitButton), { timeout: 20000 });

    // Wait for the document to be added
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled(); // Check if setDoc was called
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object), // Expect the document reference to be passed
        expect.objectContaining({
          userName: "Test User",
          email: "test@example.com",
          team: expect.any(Object), // Ensure this is a reference object
          role: "user",
          password: expect.stringMatching(/^\$2[ayb]\$.{56}$/), // bcrypt hash regex
        })
      );
    });
  });
});
