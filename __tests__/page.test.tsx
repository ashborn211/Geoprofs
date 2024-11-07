// src/app/__tests__/Home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

// Mock NextUI Button if needed
jest.mock('@nextui-org/react', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

describe('Home Component', () => {
  it('renders a button with the text "Click Me"', () => {
    render(<Home />);
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
  });

  it('renders an image with alt text "Next.js Logo"', () => {
    render(<Home />);
    const image = screen.getByAltText('Next.js Logo');
    expect(image).toBeInTheDocument();
  });

  it('renders a link with text "Docs"', () => {
    render(<Home />);
    const link = screen.getByText('Docs');
    expect(link).toBeInTheDocument();
  });
});
