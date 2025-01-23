//Door je boy Florian
describe('Login Page', () => {
    it('should display an error message for incorrect login', () => {
      cy.visit('http://localhost:3000/');
  
      // Vul een ongeldig e-mailadres in
      cy.get('input[type="email"]').type('foute@email.com');
  
      // Vul een ongeldig wachtwoord in
      cy.get('input[type="password"]').type('foutwachtwoord');
  
      // Vul een ongeldig 2FA-code in
      cy.get('input[type="text"]').type('123456');
  
  
      // Klik op de inlogknop
      cy.get('button[type="submit"]').click();
  
      // Wacht op de foutmelding
      cy.wait(1000);
  
      // Controleer of er een foutmelding wordt weergegeven
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Please complete the CAPTCHA.");
      });
    });
  });
  