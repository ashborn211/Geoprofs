describe('ResetPasswordPage Component', () => {
    beforeEach(() => {
      // Mock the user context by setting a mock user in localStorage
      const mockUser = {
        uid: "test123",
        email: "test10@gmail.com",
        userName: "Test User",
        role: "Admin",
        team: "management",
      };
  
      cy.window().then((win) => {
        win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
      });
  
      cy.visit('http://localhost:3000/reset-password');
    });
  
    it('should display a success message when the password reset is successful', () => {
      // Intercept the POST request to /api/auth/password-reset and mock a successful response
      cy.intercept('POST', '/api/auth/password-reset', {
        statusCode: 200,
        body: { message: 'Password reset email sent successfully to john.doe@example.com.' },
      }).as('passwordReset');
  
      // Spy on the alert method
      cy.window().then((window) => {
        cy.stub(window, 'alert').as('alertSpy');
      });
  
      // Type in a valid email address in the email input field
      cy.get('input[placeholder="Enter your email"]')
        .type('john.doe@example.com');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the mocked API request to complete
      cy.wait('@passwordReset');
  
      // Verify that the alert was called with the correct message
      cy.get('@alertSpy').should('have.been.calledWith', 'Password reset email sent successfully to john.doe@example.com.');
    });
  
    it('should display an error message when the API request fails', () => {
      // Intercept the POST request to /api/auth/password-reset and mock a failure response
      cy.intercept('POST', '/api/auth/password-reset', {
        statusCode: 400,
        body: { message: 'Failed to send password reset email. Please try again.' },
      }).as('passwordResetFailure');
  
      // Spy on the alert method
      cy.window().then((window) => {
        cy.stub(window, 'alert').as('alertSpy');
      });
  
      // Type in a valid email address in the email input field
      cy.get('input[placeholder="Enter your email"]')
        .type('john.doe@example.com');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the mocked API request to complete
      cy.wait('@passwordResetFailure');
  
      // Verify that the alert was called with the correct error message
      cy.get('@alertSpy').should('have.been.calledWith', 'Failed to send password reset email. Please try again.');
    });
  });
  