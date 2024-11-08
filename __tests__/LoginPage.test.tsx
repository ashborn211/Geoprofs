import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/page";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import "@testing-library/jest-dom";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

// Mock Firebase Firestore and Auth functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: "testUserId" },
  })),
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

// Mock custom hooks
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
describe("LoginPage", () => {
  const mockSetUser = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock useUser and useRouter
    (useUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Render the LoginPage only once before each test
    render(<LoginPage />);
    // Clear mocks to ensure clean state for each test
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    expect(screen.getByPlaceholderText("E-mail...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("****")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inloggen" })).toBeInTheDocument();
  });

  it("validates email format", async () => {
    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole('button', { name: 'Inloggen' });

    // Set invalid email and valid password
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Use a flexible matcher for the error message
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123", email: "test@example.com" },
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ userName: "Test User", role: "Admin", team: "Team A" }),
    });

    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: "Inloggen" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "123",
        email: "test@example.com",
        userName: "Test User",
        role: "Admin",
        team: "Team A",
      });
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  it("handles unknown errors gracefully", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/network-request-failed",
      message: "Network error occurred",
    });

    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: "Inloggen" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred. Please try again later.")).toBeInTheDocument();
    });
  });

  it("handles incorrect password error", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/wrong-password",
      message: "Incorrect password",
    });

    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: "Inloggen" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Incorrect password. Please try again.")).toBeInTheDocument();
    });
  });
});
