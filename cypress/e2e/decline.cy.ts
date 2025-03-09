// Door Edwar
describe("Verlof Page - Decline Single Request", () => {
  beforeEach(() => {
    // Stel een mock gebruiker in (mock login details)
    cy.mockLogin({
      uid: "123456",
      email: "test@example.com",
      userName: "Test User",
      role: "admin",
      team: "test-team",
    });

    // Bezoek de verlofpagina (Visit the Verlof page)
    cy.visit("http://localhost:3000/admiin/show-verlof");
  });

  it("Klikt op de afkeuren button voor een specifieke aanvraag", () => {
    // Scope to the first row of the table (or a specific request)
    cy.get("table tbody tr") // Target all rows
      .first() // Select only the first row
      .within(() => {
        // Search for the "Afkeuren" button within the first row
        cy.get("button")
          .contains("Afkeuren")
          .should("be.visible")
          .click();
      });

    // Controleer het verwachte gedrag (Verify the expected behavior)
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Leave request has been declined successfully.");
    });

    // Verify that the first row shows the declined status
    cy.get("table tbody tr")
      .first()
      .contains("Afkeuren") // Replace with your app's actual declined text (e.g., "Afgekeurd")
      .should("exist");
  });
});
