// __tests__/reset-password.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VerifyPage from "@/app/verify/page";
describe("Verify Email Integration Test", () => {
  beforeEach(() => {
    // Mock the fetch API
    global.fetch = jest.fn();

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "@/app/verify/page") {
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
    render(<VerifyPage />);

    // Input email
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, {
      target: { value: "yosef1234568910@gmail.com" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Send Reset Email"));

    // Check that the fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("@/app/api/sendVerificationEmail", {
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

    render(<VerifyPage />);

    // Input email
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, {
      target: { value: "yosef1234568910@gmail.com" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Send Reset Email"));

    // Check that the error message is displayed
    expect(await screen.findByText("Error sending email")).toBeInTheDocument();
  });
});
