import { render, screen, fireEvent } from "@testing-library/react";
import AdminPage from "@/app/admiin/page"; // Adjust this path based on your structure
import { BrowserRouter as Router } from "react-router-dom"; // Assuming the use of react-router for navigation

describe("AdminPage", () => {
  beforeEach(() => {
    render(
      <Router>
        <AdminPage />
      </Router>
    );
  });

  test("should render the sidebar and header correctly", () => {
    // Check if the sidebar link 'Log out' is rendered
    const logoutLink = screen.getByText(/Log out/i);
    expect(logoutLink).toBeInTheDocument();
    
    // Check if the header text 'Welcome, Admin' is rendered
    const welcomeText = screen.getByText(/Welcome, Admin/i);
    expect(welcomeText).toBeInTheDocument();

    // Check if the logo image is rendered correctly
    const logoImage = screen.getByLabelText("img"); 
    expect(logoImage).toBeInTheDocument();
  });

  test("should have correct link navigation", () => {
    // Check if the 'Admin Search' link navigates to the correct page
    const adminSearchLink = screen.getByText(/Go to Admin Search/i);
    expect(adminSearchLink).toHaveAttribute("href", "./admiin/admiin-search");

    // Check if the 'Add Users' link navigates to the correct page
    const addUsersLink = screen.getByText(/Go to Add Users/i);
    expect(addUsersLink).toHaveAttribute("href", "./admiin/add-users");

    // Check if the 'Teams' link navigates to the correct page
    const teamsLink = screen.getByText(/Go to teams/i);
    expect(teamsLink).toHaveAttribute("href", "./admiin/show-teams");

    // Check if the 'Users' link navigates to the correct page
    const usersLink = screen.getByText(/Go to Users/i);
    expect(usersLink).toHaveAttribute("href", "./admiin/show-user");
  });

  test("should apply styles correctly", () => {
    const header = screen.getByText(/Welcome, Admin/i);
    // Check that the background gradient is applied correctly
    expect(header).toHaveStyle(
      "background: linear-gradient(90deg, rgba(255,255,255,1) 16%, rgba(90,209,254,1) 100%)"
    );

    const sidebar = screen.getByLabelText("sidebar1");
   
    

    // Check if the logo has the expected background image
    const logo = screen.getByLabelText("img");
    expect(logo).toHaveStyle("background-image: url('/images/Logo GeoProfs.png')");
  });

  test("should display the correct number of sections", () => {
    const sections = screen.getAllByRole("link");
    expect(sections).toHaveLength(5); // since there are 5 links
  });

  test("should navigate to the correct pages on link click", () => {
    const links = [
      { text: "Go to Admin Search", href: "./admiin/admiin-search" },
      { text: "Go to Add Users", href: "./admiin/add-users" },
      { text: "Go to teams", href: "./admiin/show-teams" },
      { text: "Go to Users", href: "./admiin/show-user" },
    ];

    links.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toHaveAttribute("href", href);
    });
  });
});
