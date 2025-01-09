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

    // Bezoek de home-pagina
    cy.visit("http://localhost:3000/home");
  });

  it("should display the user's name and allow 'Ziek Melden' action", () => {
    // Controleer of de gebruikersnaam zichtbaar is
    cy.contains("Good morning, Test User").should("be.visible");

    // Controleer en klik op de 'Ziek Melden'-knop
    cy.get('button')
      .contains("Ziek Melden") // Controleer of de knop de juiste tekst bevat
      .should("be.visible") // Zorg dat de knop zichtbaar is
      .click(); // Klik op de knop
  });
});
