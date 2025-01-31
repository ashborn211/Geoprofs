// cypress/e2e/verlofPage.spec.js

describe("Verlof Page Actions", () => {
    beforeEach(() => {
      // Mock user login with appropriate details
      cy.mockLogin({
        uid: "123456",
        email: "test@example.com",
        userName: "Test User",
        role: "admin",
        team: "test-team",
      });
  
      // Visit the Verlof page
      cy.visit("http://localhost:3000/admiin/show-verlof");
    });
  
    it("Clicks on the 'Goedkeuren' button", () => {
      // Search for the 'Goedkeuren' button, ensure visibility, and click it
      cy.get("button")
        .contains("Goedkeuren")
        .scrollIntoView()
        .should("be.visible")
        .click();
  
      // Verify expected behavior (success alert or updated UI)
      cy.on("window:alert", (str) => {
        expect(str).to.equal("Leave request has been approved successfully.");
      });
  
      // Optionally verify UI changes after approval
      cy.contains("Approved").should("exist"); // Update based on your UI behavior
    });
  });
  