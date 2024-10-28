// __tests__/Home.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/home/page'; // Zorg ervoor dat je het juiste pad gebruikt
import { UserContext } from '../src/context/UserContext'; // Importeer je UserContext
import { useRouter } from 'next/router'; // Importeer useRouter

// Mock de UserContext voor de test
const mockUser = {
  uid: '123', 
  userName: 'flori',
  email: 'flori@gmail.com',
  password: '$2a$10$IjDveF/WhKMgDNb.98l4tupsmVzwdosyZhMlwOKKc/BNwXRLPO0xe',
  role: 'user',
  team: '/Team/r7Ba5DCzWT63BwbcmgX4',
};

// Mock functie voor setUser
const setUserMock = jest.fn();

// Mock de useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    // Mock de router om een waarde te geven voor pathname
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/home',
      query: {},
      asPath: '/home',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    });

    // Render de Home-component binnen de UserContext
    render(
      <UserContext.Provider value={{ user: mockUser, setUser: setUserMock }}>
        <Home />
      </UserContext.Provider>
    );
  });

  it('renders the greeting message', () => {
    expect(screen.getByText(/Goedemorgen flori/i)).toBeInTheDocument();
  });

  it('renders the "Ziek Melden" button', () => {
    expect(screen.getByText(/Ziek Melden/i)).toBeInTheDocument();
  });

  it('renders the admin button if user is admin', () => {
    const adminUser = { ...mockUser, role: 'admin' };
    
    render(
      <UserContext.Provider value={{ user: adminUser, setUser: setUserMock }}>
        <Home />
      </UserContext.Provider>
    );

    expect(screen.getByText(/Admin Action/i)).toBeInTheDocument();
  });
});
