describe("ziekmelden button", () => {
    beforeEach(() => {
      // Stel een mock gebruiker in
      cy.mockLogin({
        uid: "123456",
        email: "test@example.com",
        userName: "Test User",
        role: "user",
        team: "test-team",
      });
      cy.visit("http://localhost:3000/home"); // Ensure this is your correct URL
    });
  
    it("should submit a sick leave request", () => {
      // Click the "Ziek Melden" button
      cy.contains("Ziek Melden").click();
  
      // Check if the success popup appears
      cy.contains("Ziekmelding succesvol ingediend!").should("be.visible");
  
      // Click the "Ok" button to close the popup
      cy.contains("Ok").click();
  
      // Ensure the popup is removed
      cy.contains("Ziekmelding succesvol ingediend!").should("not.exist");
    });
  });
