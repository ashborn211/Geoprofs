// __tests__/AddUser.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page";
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import "@testing-library/jest-dom";

// Mock Firebase functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  setPersistence: jest.fn().mockImplementation(() => Promise.resolve()), // Ensure this returns a promise
  browserLocalPersistence: {},
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
}));

describe("AddUser Component", () => {
  it("renders the form correctly", () => {
    render(<AddUser />);
    expect(screen.getByPlaceholderText(/Enter naam/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a team/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a role/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Add User/i)).toBeInTheDocument();
  });

  it("submits the form and creates a user", async () => {
    const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockImplementation(
      () => Promise.resolve({ user: { uid: "mock-uid" } }) // Use a consistent mock UID
    );

    const mockSetDoc = setDoc as jest.Mock;
    mockSetDoc.mockImplementation(() => Promise.resolve());

    const mockSetPersistence = setPersistence as jest.Mock;
    mockSetPersistence.mockImplementation(() => Promise.resolve()); // Ensure it resolves a promise

    render(<AddUser />);

    fireEvent.change(screen.getByPlaceholderText(/Enter naam/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByText(/Select a team/i), {
      target: { value: "1" }, // Use Team ID = 1
    });
    fireEvent.change(screen.getByText(/Select a role/i), {
      target: { value: "admin" },
    });

    // Generate a password
    fireEvent.click(screen.getByText(/Generate Password/i));

    // Assert that the generated password is displayed
    const generatedPassword = screen.getByText(/^[a-z0-9]{8}$/i); // Assuming the generated password is 8 characters long and alphanumeric
    expect(generatedPassword).toBeInTheDocument();

    // Fill in the password field using the generated password text
    fireEvent.change(screen.getByText(/password/i), {
      target: { value: generatedPassword.textContent }, // Use the generated password from span
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add User/i));

    // Wait for the mock functions to be called
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        getAuth(),
        "john@example.com",
        generatedPassword.textContent // Use the generated password for checking
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        doc(getFirestore(), "users", "mock-uid"), // Use the consistent mock UID here
        {
          userName: "John Doe",
          email: "john@example.com",
          team: doc(getFirestore(), "Team", "1"), // Reference to the team with ID 1
          role: "admin",
          password: expect.any(String), // Check if a string is passed (hashed password)
        }
      );
    });

    expect(screen.getByText(/User added successfully!/i)).toBeInTheDocument();
  });

  it("shows an error message when the email is already taken", async () => {
    const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
    mockCreateUser.mockImplementation(() =>
      Promise.reject(new Error("Email already in use"))
    );

    render(<AddUser />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Enter naam/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByText(/Select a team/i), {
      target: { value: "1" }, // Use Team ID = 1
    });
    fireEvent.change(screen.getByText(/Select a role/i), {
      target: { value: "user" },
    });

    // Generate a password
    fireEvent.click(screen.getByText(/Generate Password/i));

    // Assert that the generated password is displayed
    const generatedPassword = screen.getByText(/^[a-z0-9]{8}$/i); // Assuming the generated password is 8 characters long and alphanumeric
    expect(generatedPassword).toBeInTheDocument();

    // Fill in the password field using the generated password text
    fireEvent.change(screen.getByText(/password/i), {
      target: { value: generatedPassword.textContent }, // Use the generated password from span
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add User/i));

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to add user. Please try again./i)
      ).toBeInTheDocument();
    });
  });
});
