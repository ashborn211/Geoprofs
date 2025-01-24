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

    // Intercept the API call for fetching users
    cy.intercept("GET", "**/users", (req) => {
      req.reply((res) => {
        res.send({
          statusCode: 200,
          body: [
            {
              id: "1",
              userName: "John Doe",
              email: "john.doe@example.com",
              team: "Development",
              role: "Developer",
            }
          ],
        });
      });
    }).as("fetchUsers");

    // Intercept the DELETE request for deleting a user
    cy.intercept("DELETE", "**/users/*", {
      statusCode: 200,
    }).as("deleteUser");

    // Visit the page
    cy.visit("http://localhost:3000/admiin/show-user"); // Adjust the path if necessary
  });

  it("should find and delete john.doe@example.com", () => {
    // Wait for users to load
    cy.wait("@fetchUsers");

    // Find the row containing john.doe@example.com
    cy.contains("tbody tr", "john.doe@example.com").within(() => {
      // Click the delete button
      cy.contains("button", "Delete").click();
    });

    // Confirm the deletion alert
    cy.on("window:confirm", () => true);

    // Wait for the DELETE request to complete
    cy.wait("@deleteUser");

    // Verify that john.doe@example.com is no longer in the table
    cy.get("tbody").should("not.contain", "john.doe@example.com");
  });
});
