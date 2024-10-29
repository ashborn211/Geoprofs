import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/home/page";
import { useUser } from "@/context/UserContext";

// Mock the useUser hook with admin role
jest.mock("@/context/UserContext", () => ({
  useUser: () => ({
    user: {
      uid: "test-uid",
      email: "test@example.com",
      userName: "Test User",
      role: "admin",
      team: "Development",
    },
    setUser: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders all main components and the admin action button", () => {
    render(<Home />);

    // Verify the greeting message
    expect(screen.getByText(/Goedemorgen Test User/i)).toBeInTheDocument();

    // Verify Logout component
    expect(screen.getByText(/Log out/i)).toBeInTheDocument();

    // Verify Calendar component
    expect(
      screen.getByLabelText(/Date \(Min Date Value\)/i)
    ).toBeInTheDocument();

    // Check for admin button visibility
    expect(screen.getByText(/Admin Action/i)).toBeInTheDocument();
  });

  it("opens VerlofComponent popup on date selection", () => {
    render(<Home />);

    // Simulate date selection in CalendarComponent
    const dateElement = screen.getByLabelText(/Date \(Min Date Value\)/i);
    fireEvent.click(dateElement);

    // Verify that VerlofComponent renders upon selecting a date
    expect(screen.getByText(/Verstuur/i)).toBeInTheDocument(); // Button in VerlofComponent
  });
});
