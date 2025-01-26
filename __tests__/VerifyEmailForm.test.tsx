import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEmailForm from '@/app/verify-email/page';

// Mock global fetch function
global.fetch = jest.fn();

describe('VerifyEmailForm', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock state
  });

  it('should render form elements correctly', () => {
    render(<VerifyEmailForm />);

    // Check if the input fields are rendered
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Send Verification Email')).toBeInTheDocument();
  });

  it('should update email and password input fields correctly', () => {
    render(<VerifyEmailForm />);

    // Simulate user typing in the email and password fields
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    // Assert that the values have been updated
    expect(screen.getByPlaceholderText('Enter your email')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Enter your password')).toHaveValue('password123');
  });

  it('should display a success message when the form is submitted successfully', async () => {
    // Mock the fetch request to simulate a successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Verification email sent.' }),
    });

    render(<VerifyEmailForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Send Verification Email'));

    // Wait for the success message to appear
    await waitFor(() => expect(screen.getByText('Verification email sent.')).toBeInTheDocument());
  });

  it('should display an error message when the form submission fails', async () => {
    // Mock the fetch request to simulate an error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to send verification email.' }),
    });

    render(<VerifyEmailForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Send Verification Email'));

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('Failed to send verification email.')).toBeInTheDocument());
  });

  it('should handle unexpected errors gracefully', async () => {
    // Mock the fetch request to simulate an unexpected error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<VerifyEmailForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Send Verification Email'));

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument());
  });
});
