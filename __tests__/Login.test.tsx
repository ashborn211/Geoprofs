import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { UserProvider } from "@/context/UserContext"; // Adjust path as necessary
import LoginPage from "@/app/page"; // Adjust path as necessary

// Define mock user data
const mockUser = {
  uid: "test-uid",
  email: "test@example.com",
  userName: "Test User",
  role: "user",
  team: "development",
};

// Test case
describe("UserProvider and LoginPage integration with mock data", () => {
  // Custom wrapper for rendering with UserProvider and mock data
  const renderWithUserProvider = (ui: React.ReactNode) => {
    return render(<UserProvider mockUser={mockUser}>{ui}</UserProvider>);
  };

  test("renders LoginPage and displays user information from mock data", async () => {
    renderWithUserProvider(<LoginPage />);

    // Wait for the component to receive mock user data
    await waitFor(() => {
      const emailDisplay = screen.getByText(/test@example.com/i);
      expect(emailDisplay).toBeInTheDocument();
    });
  });
});
