// __tests__/Home.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/home/page"; // Adjust the import based on your file structure
import { UserProvider, useUser } from "@/context/UserContext"; // Import your UserProvider
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mocking the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home Component", () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    // Mock the implementation of useRouter to return mockRouter
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders correctly and displays user information", () => {
    // Mock user data
    const user = {
      uid: "1",
      email: "test@example.com",
      userName: "Test User",
      role: "admin",
      team: "mamagment",
    };

    // Render the component with the user context
    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Access the user context
    const { setUser } = useUser();
    setUser(user); // Set the user state for testing

    // Check if user greeting is displayed
    expect(screen.getByText(/Goedemorgen Test User/i)).toBeInTheDocument();
  });

  it("navigates to admin page when admin button is clicked", () => {
    // Mock user data
    const user = {
      uid: "1",
      email: "test@example.com",
      userName: "Test User",
      role: "admin",
      team: "management",
    };

    // Render the component with the user context
    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Access the user context
    const { setUser } = useUser();
    setUser(user); // Set the user state

    // Click the admin button
    fireEvent.click(screen.getByText(/Admin Action/i));

    // Expect the router's push method to have been called
    expect(mockRouter.push).toHaveBeenCalledWith("/admin"); // Adjust the path if needed
  });

  it("opens the VerlofComponent popup when a date is selected", () => {
    // Render the component with the user context
    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Simulate selecting a date (adjust based on how your CalendarComponent exposes the selection)
    const calendarButton = screen.getByRole("button", { name: /Ziek Melden/i }); // Adjust based on your CalendarComponent
    fireEvent.click(calendarButton); // Simulate a date selection

    // Verify that VerlofComponent is rendered by checking for a specific text or element from it
    expect(screen.getByText(/Ziek Melden/i)).toBeInTheDocument(); // Adjust based on actual content of VerlofComponent
  });
});
