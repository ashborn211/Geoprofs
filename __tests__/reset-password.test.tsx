// __tests__/reset-password.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import "@testing-library/jest-dom";

describe("ResetPasswordForm Integration Test", () => {
  beforeEach(() => {
    // Mock the fetch API
    global.fetch = jest.fn();

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/reset-password") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Password reset email sent" }),
        });
      }
      return Promise.reject(new Error("Unknown API"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should send password reset email when form is submitted", async () => {
    render(<ResetPasswordForm />);

    // Input email
    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, {
      target: { value: "yosef1234568910@gmail.com" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Send Reset Email"));

    // Check that the fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "yosef1234568910@gmail.com" }),
      });
    });

    // Check that the success message is displayed
    expect(
      await screen.findByText("Password reset email sent")
    ).toBeInTheDocument();
  });

  test("should display error message on API failure", async () => {
    // Mock fetch to return a failure response
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Error sending email" }),
      });
    });

    render(<ResetPasswordForm />);

    // Input email
    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, {
      target: { value: "yosef1234568910@gmail.com" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Send Reset Email"));

    // Check that the error message is displayed
    expect(await screen.findByText("Error sending email")).toBeInTheDocument();
  });
});
