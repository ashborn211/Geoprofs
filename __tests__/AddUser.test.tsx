// __tests__/AddUser.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "@/FireBase/FireBaseConfig";
import "@testing-library/jest-dom/extend-expect";

// Mock Firebase functions
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

// Mock team data
const mockTeams = [
  { id: "team1", TeamName: "Team One" },
  { id: "team2", TeamName: "Team Two" },
];

// Mock Firestore data fetching
(getDocs as jest.Mock).mockImplementation(() => {
  return Promise.resolve({
    docs: mockTeams.map((team) => ({ id: team.id, data: () => team })),
  });
});

describe("AddUser Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates and displays a random password when the "Generate Password" button is clicked', () => {
    render(<AddUser />);

    const generatePasswordButton = screen.getByText("Generate Password");
    fireEvent.click(generatePasswordButton);

    // Check if the generated password is displayed
    const passwordDisplay = screen.getByText(/^[a-z0-9]{8}$/i); // Regex to match the expected random password format
    expect(passwordDisplay).toBeInTheDocument(); // Check if the password is displayed
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
    const generatedPassword = screen.getByText(/^[a-z0-9]{8}$/i);

    // Submit the form
    fireEvent.click(screen.getByText("Add User"));

    // Wait for the document to be added
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object), // Expect the document reference to be passed
        expect.objectContaining({
          userName: "Test User",
          email: "test@example.com",
          team: expect.any(Object), // Ensure this is a reference object
          role: "user",
          // Password should be hashed, so we can use a regex here
          password: expect.stringMatching(/^\$2[ayb]\$.{56}$/), // bcrypt hash regex
        })
      );
    });
  });
});
