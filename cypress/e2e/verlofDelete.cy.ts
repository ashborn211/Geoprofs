// cypress/e2e/verlofDelete.cy.test.ts

describe('Email Verification Utils', () => {
    before(() => {
        // Connect to the Firebase emulator
        cy.exec('firebase emulators:start');
    });

    beforeEach(() => {
        // Reset the state before each test
        cy.visit('http://localhost:3000/home');
    });

    after(() => {
        // Stop the Firebase emulator
        cy.exec('firebase emulators:stop');
    });

    it('should send a verification email successfully', () => {
        // Sign in the test user
        cy.login('test@example.com', 'password123');

        // Mock the API response
        cy.intercept('POST', '/api/auth/send-verification', {
            statusCode: 200,
            body: { message: 'Verification email sent successfully.' },
        }).as('sendVerification');

        // Call the handleSendVerification function
        cy.window().then((win) => {
            win.handleSendVerification(cy.stub(), cy.stub(), cy.stub());
        });

        // Verify the API call and the expected outcomes
        cy.wait('@sendVerification').its('response.statusCode').should('eq', 200);
        cy.get('@sendVerification').its('response.body.message').should('eq', 'Verification email sent successfully.');
    });

    it('should handle error when no user is authenticated', () => {
        // Sign out the current user
        cy.logout();

        // Call the handleSendVerification function
        cy.window().then((win) => {
            win.handleSendVerification(cy.stub(), cy.stub(), cy.stub());
        });

        // Verify the expected outcomes
        cy.get('@setError').should('have.been.calledWith', 'User is not authenticated.');
    });

    it('should handle successful email verification', () => {
        // Mock the API response
        cy.intercept('POST', '/api/auth/confirm-verification', {
            statusCode: 200,
            body: { message: 'Email successfully verified!' },
        }).as('confirmVerification');

        const verificationCode = 'validCode';

        // Call the handleConfirmVerification function
        cy.window().then((win) => {
            win.handleConfirmVerification(verificationCode, cy.stub(), cy.stub(), cy.stub(), cy.stub());
        });

        // Verify the API call and the expected outcomes
        cy.wait('@confirmVerification').its('response.statusCode').should('eq', 200);
        cy.get('@confirmVerification').its('response.body.message').should('eq', 'Email successfully verified!');
    });

    it('should handle failed email verification', () => {
        // Mock the API response
        cy.intercept('POST', '/api/auth/confirm-verification', {
            statusCode: 400,
            body: { error: 'Invalid verification code.' },
        }).as('confirmVerification');

        const verificationCode = 'invalidCode';

        // Call the handleConfirmVerification function
        cy.window().then((win) => {
            win.handleConfirmVerification(verificationCode, cy.stub(), cy.stub(), cy.stub(), cy.stub());
        });

        // Verify the API call and the expected outcomes
        cy.wait('@confirmVerification').its('response.statusCode').should('eq', 400);
        cy.get('@confirmVerification').its('response.body.error').should('eq', 'Invalid verification code.');
    });

    it('should handle unexpected error during email verification', () => {
        // Mock the API response
        cy.intercept('POST', '/api/auth/confirm-verification', {
            statusCode: 500,
            body: { error: 'An unexpected error occurred.' },
        }).as('confirmVerification');

        const verificationCode = 'errorCode';

        // Call the handleConfirmVerification function
        cy.window().then((win) => {
            win.handleConfirmVerification(verificationCode, cy.stub(), cy.stub(), cy.stub(), cy.stub());
        });

        // Verify the API call and the expected outcomes
        cy.wait('@confirmVerification').its('response.statusCode').should('eq', 500);
        cy.get('@confirmVerification').its('response.body.error').should('eq', 'An unexpected error occurred.');
    });
});
// Install the Cypress extension in Visual Studio Code
// 1. Open Visual Studio Code.
// 2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
// 3. In the Extensions view, type "Cypress" in the search box.
// 4. Find the "Cypress Support" extension by "cypress" and click the Install button.
// 5. Once installed, you can use the extension to run and debug your Cypress tests directly from Visual Studio Code.