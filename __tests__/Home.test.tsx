import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for additional matchers
import Home from '@/app/home/page';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

// Mock useUser hook
jest.mock('@/context/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock useRouter hook from Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { userName: 'Test User', role: 'admin' },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  test('renders greeting with user name', () => {
    render(<Home />);
    expect(screen.getByText(/Goedemorgen Test User/i)).toBeInTheDocument();
  });

  test('renders admin button if user is an admin', () => {
    render(<Home />);
    const adminButton = screen.getByText(/Admin Action/i);
    expect(adminButton).toBeInTheDocument();
    fireEvent.click(adminButton);
    expect(useRouter().push).toHaveBeenCalledWith('/admiin');
  });

  test('renders CalendarComponent', () => {
    render(<Home />);
    const calendarComponent = screen.getByLabelText(/Date \(Min Date Value\)/i);
    expect(calendarComponent).toBeInTheDocument();
  });

  test('renders Logout button', () => {
    render(<Home />);
    const logoutButton = screen.getByText(/Log out/i);
    expect(logoutButton).toBeInTheDocument();
  });

  test('renders VerlofComponent on date selection', () => {
    render(<Home />);
    const calendarComponent = screen.getByLabelText(/Date \(Min Date Value\)/i);
    
    // Mock date selection event
    fireEvent.click(calendarComponent);
    
    const verlofComponent = screen.queryByText(/reden.../i);
    expect(verlofComponent).toBeInTheDocument();
  });
});
