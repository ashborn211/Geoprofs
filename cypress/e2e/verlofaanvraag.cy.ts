//door je boy Florian
describe("Home Page", () => {
    beforeEach(() => {
      // Stel een mock gebruiker in
      cy.mockLogin({
        uid: "123456",
        email: "test@example.com",
        userName: "Test User",
        role: "user",
        team: "test-team",
      });
  
      cy.visit("http://localhost:3000/home");
    });
  
    it("should display the user's name and allow 'verlofaanvraag' action", () => {
      cy.contains("Good morning, Test User").should("be.visible");
  
      // Klik op een dag (bijvoorbeeld de 25e van de maand)
      cy.get('span')
        .contains("25")
        .should("be.visible") 
        .click();
  
      // Controleer of de juiste labels aanwezig zijn
      cy.get('label').invoke('text').should('contain', 'Select Leave Type:');
      cy.get('label').invoke('text').should('contain', 'Start Date and Time:');
      cy.get('label').invoke('text').should('contain', 'End Date and Time:');
  
      // Selecteer een verloftype
      cy.get('select').select('vakantie'); // Pas de waarde aan afhankelijk van je gegevens
  
      // Voer een startdatum en -tijd in
      cy.get('#startdate-input')
        .type("2025-01-23T09:00"); // Voorbeeldwaarde voor startdatum en tijd
  
      // Voer een einddatum en -tijd in
      cy.get('#enddate-input')
        .type("2025-01-23T17:00"); // Voorbeeldwaarde voor einddatum en tijd
  
      // Vul een reden in
      cy.get('.reason-textarea').type("Ik wil op vakantie met Edwar"); // Pas de waarde aan afhankelijk van je gegevens
  
      // Klik op de verstuurknop
      cy.get('.submit-button').click();
    });
  });
  