// __tests__/verify-email.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEmailForm from '@/components/VerifyEmailForm';
import '@testing-library/jest-dom';

describe('VerifyEmailForm Integration Test', () => {
  beforeEach(() => {
    // Mock the fetch API
    global.fetch = jest.fn();

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/verify-email') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Verification email sent' }),
        });
      }
      return Promise.reject(new Error('Unknown API'));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should send verification email when form is submitted', async () => {
    render(<VerifyEmailForm />);

    // Input email and password
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByText('Send Verification Email'));

    // Check that fetch was called with correct arguments
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
    });

    // Check that the success message is displayed
    expect(await screen.findByText('Verification email sent')).toBeInTheDocument();
  });

  test('should display error message on API failure', async () => {
    // Mock fetch to return a failure response
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error sending verification email' }),
      });
    });

    render(<VerifyEmailForm />);

    // Input email and password
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByText('Send Verification Email'));

    // Check that the error message is displayed
    expect(await screen.findByText('Error sending verification email')).toBeInTheDocument();
  });


});
