/// <reference types="cypress" />

describe('VerifyEmailForm', () => {
    beforeEach(() => {
        // Log in using Cypress custom command
        cy.login("test10@gmail.com", "8^!@C4hybR");

        cy.visit('http://localhost:3000/verify-email');
    });

    it('should display the current user email', () => {
        cy.contains('Current Email: test10@gmail.com').should('be.visible');
    });

    it('should allow sending a verification email', () => {
        // Click "Send Verification Email"
        cy.contains('Send Verification Email').click();

        // Verify loading state
        cy.contains('Processing...').should('be.visible');

        // Verify success message
        cy.contains('Verification email sent successfully').should('be.visible');
    });

    // it('should allow confirming a verification code', () => {
    //   // Enter a verification code
    //   cy.get('input#verificationCode').type('123456');

    //   // Click "Confirm Verification Code"
    //   cy.contains('Confirm Verification Code').click();

    //   // Verify loading state
    //   cy.contains('Processing...').should('be.visible');

    //   // Verify success message
    //   cy.contains('Email verified successfully').should('be.visible');
    // });

    it('should show an error if no verification code is entered', () => {
        // Try clicking "Confirm Verification Code" without entering a code
        cy.contains('Confirm Verification Code').click();

        // Verify error message
        cy.contains('Verification code is required').should('be.visible');
    });
});
