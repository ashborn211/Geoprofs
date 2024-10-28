import { render, screen, fireEvent } from "@testing-library/react";
import AddUser from "@/app/admiin/add-users/page"; // Adjust the import path if necessary
import { auth, db } from "@/FireBase/FireBaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Mock Firebase functions
jest.mock("firebase/firestore", () => {
  return {
    ...jest.requireActual("firebase/firestore"), // Keep actual implementations for other methods
    getFirestore: jest.fn(() => ({})), // Mock getFirestore
    collection: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});

jest.mock("firebase/auth", () => {
  return {
    ...jest.requireActual("firebase/auth"), // Keep actual implementations for other methods
    getAuth: jest.fn(() => ({
      /* mock return value if needed */
    })),
    createUserWithEmailAndPassword: jest.fn(),
  };
});

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

  test("renders the form and submits successfully", async () => {
    render(<AddUser />);

    // Verify the form is rendered
    expect(screen.getByLabelText(/Naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();

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
    await fireEvent.click(screen.getByText(/Add User/i));

    // Check that setDoc and createUserWithEmailAndPassword were called correctly
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "john@example.com",
      expect.any(String)
    );
    expect(setDoc).toHaveBeenCalledWith(doc(db, "users", "randomUserId"), {
      userName: "John Doe",
      email: "john@example.com",
      team: doc(db, "Team", mockTeam.id),
      role: "admin",
      password: expect.any(String),
    });
  });

  test("shows an alert if the email is already taken", async () => {
    render(<AddUser />);

    // Mock email check
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

    fireEvent.click(screen.getByText(/Add User/i));

    // Check if alert was called
    expect(window.alert).toHaveBeenCalledWith(
      "Email already taken. Please use a different email."
    );
  });
});
