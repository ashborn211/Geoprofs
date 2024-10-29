// __tests__/Home.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { UserProvider } from "@/context/UserContext"; // Adjust the import path
import Home from "@/app/home/page"; // Adjust the import path
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter for routing context

// Mock user data
const mockAdminUser = {
  uid: "123",
  email: "test@example.com",
  userName: "John Doe",
  role: "admin",
  team: "management", // Changed to "management"
};

const mockNonAdminUser = {
  uid: "124",
  email: "user@example.com",
  userName: "Jane Smith",
  role: "user",
  team: null,
};

// Custom render function to include UserProvider
const renderWithUserContext = (children: React.ReactNode, user = mockAdminUser) => {
  return render(
    <MemoryRouter>
      <UserProvider value={{ user, setUser: jest.fn() }}>
        {children}
      </UserProvider>
    </MemoryRouter>
  );
};

describe("Home Component", () => {
  it("renders correctly with admin user", () => {
    renderWithUserContext(<Home />, mockAdminUser);

    expect(screen.getByText(/Good morning John Doe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Admin Action/i })).toBeInTheDocument();
  });

  it("does not render admin button for non-admin user", () => {
    renderWithUserContext(<Home />, mockNonAdminUser);

    expect(screen.queryByRole("button", { name: /Admin Action/i })).not.toBeInTheDocument();
  });
});
