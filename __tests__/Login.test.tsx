import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/page"; // Adjust to your actual file path
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("LoginPage", () => {
  let mockSetUser: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockSetUser = jest.fn();
    mockRouterPush = jest.fn();

    // Mock `useRouter` return value
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Explicitly mock useUser with correct return type
    (useUser as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });
  });

  test("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText("E-mail...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("****")).toBeInTheDocument();
    expect(screen.getByText("Inloggen")).toBeInTheDocument();
  });

  test("displays error on invalid email format", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("E-mail..."), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByPlaceholderText("****"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Inloggen"));

    await waitFor(() => {
      expect(screen.queryByText("Invalid email format")).not.toBeNull();
    });
  });

  test("handles login success", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    const mockUserData = {
      userName: "Test User",
      role: "admin",
      team: "Dev Team",
    };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: true,
      data: () => mockUserData,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("E-mail..."), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("****"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Inloggen"));

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "123",
        email: "test@example.com",
        userName: "Test User",
        role: "admin",
        team: "Dev Team",
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/home");
    });
  });

  test("handles login failure with wrong password", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/wrong-password",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("E-mail..."), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("****"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Inloggen"));

    await waitFor(() => {
      expect(screen.queryByText("Incorrect password. Please try again.")).not.toBeNull();
    });
  });

  test("handles user not found", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/user-not-found",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("E-mail..."), {
      target: { value: "notfound@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("****"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Inloggen"));

    await waitFor(() => {
      expect(screen.queryByText("User does not exist. Do you want to register?")).not.toBeNull();
    });
  });

  test("handles generic login failure", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error("Login failed"));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("E-mail..."), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("****"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Inloggen"));

    await waitFor(() => {
      expect(screen.queryByText("Login failed. Please try again.")).not.toBeNull();
    });
  });
});
