describe("User Creation - Add User Page", () => {
    beforeEach(() => {
        // Mock the user context by setting a mock user in localStorage
        const mockUser = {
            uid: "test123",
            email: "test10@gmail.com",
            userName: "Test User",
            role: "Admin",
            team: "managment",
        };

        cy.window().then((win) => {
            win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
        });

        // Visit the Add User page
        cy.visit("http://localhost:3000/admiin/add-users"); // Ensure the correct path is used
    });

    it("should load the Add User form and display team options", () => {
        cy.get("form").should("be.visible");
        cy.get('input[placeholder="Enter naam"]').should("be.visible");
        cy.get('input[placeholder="Enter email"]').should("be.visible");
        cy.get('input[placeholder="Enter BSN number"]').should("be.visible");
        cy.get("select").eq(0).should("be.visible");
        cy.get("select").eq(1).should("be.visible");

        // Verify team options
        cy.get("select")
            .eq(0)
            .find("option")
            .should("have.length.at.least", 2) // Includes "Select a team" and dynamic options
            .then((options) => {
                const values = [...options].map((o) => o.textContent?.trim() || ""); // Use optional chaining to handle null
                expect(values).to.include("managment"); // Adjust based on actual team names in the list
                expect(values).to.include("ICT"); // Adjust based on actual team names in the list
            });
    });

    it("should successfully add a user with valid details", () => {
        cy.intercept("POST", "/api/auth/password-reset", {
            statusCode: 200,
            body: { message: "Password reset email sent successfully to john.doe@example.com." },
        }).as("passwordReset");

        cy.get('input[placeholder="Enter naam"]').type("John Doe");
        cy.get('input[placeholder="Enter email"]').type("john.doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("995759996");
        cy.get("select").eq(0).select("managment");
        cy.get("select").eq(1).select("Admin");

        cy.get("button").contains("Generate Password").click();
        cy.get("button").contains("Generate Password").should("not.be.disabled");

        cy.get('button[type="submit"]').click();

        cy.wait("@passwordReset");

        cy.on("window:alert", (alertText) => {
            expect(alertText).to.equal("Password reset email sent successfully to john.doe@example.com.");
        });

    });
    it("should show an error for invalid BSN numbers", () => {
        // Fill out the form with an invalid BSN
        cy.get('input[placeholder="Enter naam"]').type("Jess Doe");
        cy.get('input[placeholder="Enter email"]').type("jess.doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("000000012"); // Invalid BSN
        cy.get("select").eq(0).select("ICT");
        cy.get("select").eq(1).select("User");

        // Generate password
        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Assert BSN error message
        cy.on("window:alert", (alertText) => {
            expect(alertText).to.equal("Invalid BSN number. Please enter a valid BSN.");
        });


    });
});