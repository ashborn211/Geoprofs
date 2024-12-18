import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/page"; 
import { useUser } from "@/context/UserContext";
import { auth } from "@/FireBase/FireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";


jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@hcaptcha/react-hcaptcha", () => ({
  __esModule: true,
  default: jest.fn(({ onVerify }: any) => {
    return <div data-testid="hcaptcha-mock" onClick={() => onVerify("mock-token")}>Mock CAPTCHA</div>;
  }),
}));
jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("LoginPage Component", () => {
  const mockRouterPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("E-mail...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("****")).toBeInTheDocument();
    expect(screen.getByText("Inloggen")).toBeInTheDocument();
    expect(screen.getByTestId("hcaptcha-mock")).toBeInTheDocument();
  });

  test("validates email format", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("E-mail...");
    const submitButton = screen.getByRole("button", { name: /inloggen/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  test("disables the submit button while submitting", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: /inloggen/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByTestId("hcaptcha-mock")); 

    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
  });

  test("calls Firebase signInWithEmailAndPassword on successful login", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123", email: "test@example.com", emailVerified: true },
    });

    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: /inloggen/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByTestId("hcaptcha-mock")); 

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockSetUser).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/home");
    });
  });

  test("handles login errors correctly", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/wrong-password",
    });

    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("E-mail...");
    const passwordInput = screen.getByPlaceholderText("****");
    const submitButton = screen.getByRole("button", { name: /inloggen/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByTestId("hcaptcha-mock")); // Mock CAPTCHA

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Incorrect password. Please try again.")).toBeInTheDocument();
    });
  });
});