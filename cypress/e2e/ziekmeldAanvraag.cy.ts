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

  it("should display the user's name and allow 'Ziek Melden' action", () => {

    cy.contains("Good morning, Test User").should("be.visible");


    cy.get('button')
      .contains("Ziek Melden")
      .should("be.visible") 
      .click();

    cy.get('h2').invoke('text').should('contain', 'Ziekmelding succesvol ingediend!');
  });
});