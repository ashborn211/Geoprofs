describe("Home Page", () => {
  beforeEach(() => {
    // Stel een mock gebruiker in
    cy.mockLogin({
      uid: "123456",
      email: "test@example.com",
      userName: "Test User",
      role: "admin",
      team: "test-team",
    });

    // Bezoek de home-pagina
    cy.visit("http://localhost:3000/home");
  });

  it("should display the user's name", () => {
    cy.contains("Good morning, Test User").should("be.visible");
  });
});
