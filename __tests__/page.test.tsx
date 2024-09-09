// __test__/page.test.ts
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // for additional matchers like toBeInTheDocument
import Home from "../src/app/page"; // Import the component using relative path from __test__

describe("Home Page", () => {
  it("renders the home page without crashing", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it('renders a "Click Me" button', () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the Vercel logo", () => {
    render(<Home />);
    const vercelLogo = screen.getByAltText("Vercel Logo");
    expect(vercelLogo).toBeInTheDocument();
  });

  it("renders the Next.js logo", () => {
    render(<Home />);
    const nextLogo = screen.getByAltText("Next.js Logo");
    expect(nextLogo).toBeInTheDocument();
  });

  it('renders the "Docs" link with text and href', () => {
    render(<Home />);
    const docsLink = screen.getByRole("link", { name: /Docs/ });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs")
    );
  });
});
