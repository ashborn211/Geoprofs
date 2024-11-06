import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { UserProvider } from "@/context/UserContext"; // Adjust path as necessary
import LoginPage from "@/app/page"; // Adjust path as necessary

// Mock the Firebase modules
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

// Import Firebase functions after mocking to ensure correct mock behavior
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";

describe("UserProvider and LoginPage integration", () => {
  beforeEach(() => {
    // Mock `onAuthStateChanged` to simulate user login
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      const mockUser = { uid: "test-uid", email: "test@example.com" };
      callback(mockUser); // Simulate logged-in user
      return jest.fn(); // Return a mock unsubscribe function
    });

    // Mock `getDoc` to return user data from Firestore
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        userName: "Test User",
        role: "user",
        team: "development",
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  // Custom wrapper for rendering with UserProvider
  const renderWithUserProvider = (ui: React.ReactNode) => {
    return render(<UserProvider>{ui}</UserProvider>);
  };

  test("renders LoginPage and displays user information after login", async () => {
    renderWithUserProvider(<LoginPage />);

    // Wait for the component to receive user data and set state in UserProvider
    await waitFor(() => {
      const emailDisplay = screen.getByText(/test@example.com/i);
      expect(emailDisplay).toBeInTheDocument();
    });
  });
});
