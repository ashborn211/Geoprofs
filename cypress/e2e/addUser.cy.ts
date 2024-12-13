// cypress/e2e/addUserTest.cy.ts
describe("Add User Component", () => {
    beforeEach(() => {
        // Log the user in using the custom login command
        cy.login("test10@gmail.com", "8^!@C4hybR");

        // Visit the Add User page
        cy.visit("http://localhost:3000/admiin/add-users");

        // Intercept Firestore and Firebase API calls
        cy.intercept("GET", "/api/auth/password-reset", {
            statusCode: 200,
            body: { message: "Password reset email sent successfully" },
        }).as("passwordReset");

        cy.intercept("GET", "**/Team", {
            statusCode: 200,
            body: [
                { id: "1", TeamName: "managment" },
                { id: "2", TeamName: "ICT" },
            ],
        }).as("getTeams");

        cy.intercept("POST", "**/users", {
            statusCode: 200,
        }).as("createUser");

        cy.intercept("GET", "**/users?where=email", {
            statusCode: 200,
            body: { exists: false }, // Default email check (simulate no conflict)
        }).as("checkEmail");
    });

    it("should load the Add User form and display team options", () => {
        cy.get("form").should("be.visible");
        cy.get('input[placeholder="Enter naam"]').should("be.visible");
        cy.get('input[placeholder="Enter email"]').should("be.visible");
        cy.get("select").eq(0).should("be.visible");
        cy.get("select").eq(1).should("be.visible");

        // Verify team options
        cy.get("select")
            .eq(0)
            .find("option")
            .should("have.length", 3) // Includes "Select a team"
            .then((options) => {
                const values = [...options].map((o) => o.textContent);
                expect(values).to.include("managment");
                expect(values).to.include("ICT");
            });
    });

    it("should generate a password and copy it to clipboard", () => {
        cy.get("button").contains("Generate Password").click();
      
    });

    it("should successfully add a user", () => {
        // Fill out the form with valid data
        cy.get('input[placeholder="Enter naam"]').type("John Doe");
        cy.get('input[placeholder="Enter email"]').type("john.doe@example.com");
        cy.get("select").eq(0).select("managment");
        cy.get("select").eq(1).select("Admin");

        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the create user request to finish
        cy.wait('@createUser');

        // Assert success message
        cy.on("window:alert", (str) => {
            expect(str).to.equal("Password reset email sent successfully");
        });
    });

    it("should show an error if email is already taken", () => {
        // Simulate email conflict
        cy.intercept("GET", "**/users?where=email", {
            statusCode: 200,
            body: { exists: true },
        }).as("checkEmail");

        // Fill out the form with an existing email
        cy.get('input[placeholder="Enter naam"]').type("Jane Doe");
        cy.get('input[placeholder="Enter email"]').type("jane.doe@example.com");
        cy.get("select").eq(0).select("ICT");
        cy.get("select").eq(1).select("User");

        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the email check request to finish
        cy.wait('@checkEmail');

        // Assert error alert
        cy.on("window:alert", (str) => {
            expect(str).to.equal("Email already taken. Please use a different email.");
        });
    });
});
