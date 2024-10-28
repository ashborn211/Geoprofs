import { render, screen, fireEvent, act } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page"; // Adjust the import path if necessary
import { auth, db } from "@/FireBase/FireBaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

describe("AddUser Component", () => {
  const mockTeam = {
    id: "1",
    TeamName: "management",
  };

  beforeEach(() => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: mockTeam.id,
          data: () => ({ TeamName: mockTeam.TeamName }),
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("successfully creates a user", async () => {
    render(<AddUser />);

    // Fill the form
    fireEvent.change(screen.getByLabelText(/Naam/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Team/i), {
      target: { value: mockTeam.id },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: "admin" },
    });

    // Mock password generation
    fireEvent.click(screen.getByText(/Generate Password/i));

    // Mock createUserWithEmailAndPassword and setDoc
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "randomUserId" },
    });

    (setDoc as jest.Mock).mockResolvedValueOnce({});

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText(/Add User/i));
    });

    // Check that createUserWithEmailAndPassword was called correctly
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "john@example.com",
      expect.any(String) // Assuming the generated password is used here
    );

    // Check that setDoc was called to create the user document in Firestore
    expect(setDoc).toHaveBeenCalledWith(doc(db, "users", "randomUserId"), {
      userName: "John Doe",
      email: "john@example.com",
      team: doc(db, "Team", mockTeam.id),
      role: "admin",
      password: expect.any(String), // Assuming you have a password handling mechanism
    });
  });

  test("shows an alert if the email is already taken", async () => {
    render(<AddUser />);

    // Mock email check to simulate that email already exists
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false, // Simulate that email exists
    });

    fireEvent.change(screen.getByLabelText(/Naam/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Team/i), {
      target: { value: mockTeam.id },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: "user" },
    });

    // Submit the form
    window.alert = jest.fn(); // Mock alert

    await act(async () => {
      fireEvent.click(screen.getByText(/Add User/i));
    });

    // Check if alert was called
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      "Email already taken. Please use a different email."
    );
  });
});
