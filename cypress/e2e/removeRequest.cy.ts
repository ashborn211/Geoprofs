describe("Verwijder Ziekmelden Request", () => {
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

    it('should select Monday 9th and submit sick leave request, then delete it.', () => {
        // Click on the date 9th (assuming it's Monday)
        cy.contains('9').click();
    
        // Click on the 'Select Leave Type:' dropdown
        cy.contains('Select Leave Type:').click();
    
        // Wait for dropdown to be visible
        cy.get('select').should('be.visible');
    
        // Choose 'ziek' from the dropdown, forcing the click
        cy.get('select').select('ziek', { force: true });

        cy.get('.reason-textarea').click().type('Ik ben ziek vandaag');

        cy.contains("Verstuur").click();

        cy.wait(1000); 

        cy.wait(1000); 

        cy.contains('9').click();

        cy.contains("Remove").click();

        cy.contains("Remove").should('not.exist'); 
        cy.contains("Ik ben ziek vandaag").should('not.exist');
      });
    });
  