describe("Show Users Page", () => {
    beforeEach(() => {
      // Set a mock user in local storage
      const mockUser = {
        uid: "test123",
        email: "test10@gmail.com",
        userName: "Test Admin",
        role: "Admin",
        team: "management",
      };
  
      cy.window().then((win) => {
        win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
      });
      cy.intercept("GET", "**/users", { fixture: "users.json" }).as("fetchUsers");

      // Visit the page where the Team User Table component is rendered
      cy.visit("http://localhost:3000/admiin/show-user"); // Adjust the path if necessary
    });
  
    it("should display the user list table", () => {
      // Check if the table header exists
      cy.get("table").should("exist");
      cy.get("thead").within(() => {
        cy.contains("th", "ID");
        cy.contains("th", "Name");
        cy.contains("th", "Email");
        cy.contains("th", "Team");
        cy.contains("th", "Role");
        cy.contains("th", "Actions");
      });
    });
  
    it("should display users loaded from Firestore", () => {
     
  
      // Reload the page to trigger data fetch
      cy.reload();
  
      // Wait for the users data to load
      cy.wait("@fetchUsers");
  
      // Check if users are displayed in the table
      cy.get("tbody").within(() => {
        cy.contains("td", "Test User 1");
        cy.contains("td", "testuser1@example.com");
        cy.contains("td", "Development");
      });
    });
  
    it("should delete a user when the delete button is clicked", () => {
      // Mock Firestore data and intercept the delete request
     
  
      cy.intercept("DELETE", "/users/*", {
        statusCode: 200, // Mock successful deletion
      }).as("deleteUser");
  
      // Reload and wait for data to load
      cy.reload();
      cy.wait("@fetchUsers");
  
      // Click the delete button for the first user
      cy.get("tbody tr").first().within(() => {
        cy.contains("button", "Delete").click();
      });
  
      // Confirm the deletion alert
      cy.on("window:confirm", () => true);
  
      // Wait for the delete request to complete
      cy.wait("@deleteUser");
  
      // Verify the user is removed from the table
      cy.get("tbody").should("not.contain", "Test User 1");
    });
  
    it("should display loading indicator while users are being fetched", () => {
      // Ensure the loading message is displayed before users are loaded
      cy.get("p").contains("Loading users...").should("exist");
    });
  });
  