// cypress/e2e/verlofPageDecline.spec.js

// Door Edwar
describe("Verlof Page - Decline Action", () => {
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
  
    it("Klikt op de afkeuren button", () => {
      // Zoek de 'Afkeuren' knop (Search for the 'Afkeuren' button), ensure visibility, and click
      cy.get("button")
        .contains("Afkeuren")
        .scrollIntoView()
        .should("be.visible")
        .click();
  
      // Controleer het verwachte gedrag (Verify the expected behavior)
      cy.on("window:alert", (str) => {
        expect(str).to.equal("Leave request has been declined successfully.");
      });

      
    });
  });
  