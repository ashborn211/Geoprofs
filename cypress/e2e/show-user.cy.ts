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

    // Visit the Show User page
    cy.visit("http://localhost:3000/admiin/show-user"); // Adjust the path if necessary
  });

  it("should find and delete john.doe@example.com", () => {
    // Ensure the table is visible
    cy.get("table").should("be.visible");

    // Ensure the user list is loaded
    cy.contains("tbody tr", "john.doe@example.com", { timeout: 10000 }).should(
      "exist"
    );

    // Find the row containing john.doe@example.com
    cy.contains("tbody tr", "john.doe@example.com").within(() => {
      // Click the delete button
      cy.contains("button", "Delete").click();
    });

    // Confirm the deletion alert
    cy.on("window:confirm", (alertText) => {
      expect(alertText).to.equal(
        "Are you sure you want to delete this user?"
      );
      return true; // Simulate clicking "OK" on the confirmation dialog
    });

    // Verify that the user has been removed from the table
    cy.get("tbody").should("not.contain", "john.doe@example.com");
    
  });
});
