// __tests__/ResetPasswordForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

// Mocking the fetch function globally
global.fetch = jest.fn();

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  test('fills in the form and submits successfully', async () => {
    // Mocking the fetch response for a successful submission
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'Password reset email sent' }),
    });

    render(<ResetPasswordForm />);

    // Get the input and button elements
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /send reset email/i });

    // Fill in the email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');

    // Click the submit button
    fireEvent.click(submitButton);

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });

    // Ensure fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  test('handles error response from the API', async () => {
    // Mocking the fetch response for an error
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'Error sending email' }),
    });

    render(<ResetPasswordForm />);

    // Get the input and button elements
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole('button', { name: /send reset email/i });

    // Fill in the email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Click the submit button
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/error sending email/i)).toBeInTheDocument();
    });
  });
});
