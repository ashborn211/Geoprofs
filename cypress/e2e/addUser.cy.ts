describe("Add User Component", () => {
    beforeEach(() => {
        // Mock the user context by setting a mock user in localStorage
        const mockUser = {
            uid: "test123",
            email: "test10@gmail.com",
            userName: "Test User",
            role: "Admin",
            team: "Management",
        };

        cy.window().then((win) => {
            win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
        });

        // Visit the Add User page
        cy.visit("http://localhost:3000/admiin/add-users");
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
                expect(values).to.include("managment");
                expect(values).to.include("ICT");
            });
    });

    it("should successfully add a user with valid details", () => {


        // Fill out the form with valid data
        cy.get('input[placeholder="Enter naam"]').type("John Doe");
        cy.get('input[placeholder="Enter email"]').type("john.doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("995759996");
        cy.get("select").eq(0).select("managment");
        cy.get("select").eq(1).select("Admin");

        // Generate password
        cy.get("button").contains("Generate Password").click();
        cy.get("button").contains("Generate Password").should("not.be.disabled");

        // Submit the form
        cy.get('button[type="submit"]').click();
        cy.on("window:alert", (alertText) => {
            // Verify the alert message
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
        cy.on("window:alert", (str) => {
            expect(str).to.equal("Invalid BSN number. Please enter a valid BSN.");
        });
    });

    it("should show an error if BSN is already taken", () => {
        // Simulate Firestore BSN check directly in the page (simulate this with Cypress)
        cy.window().then((win) => {
            // Simulate that this BSN already exists in Firestore
            const existingBSN = "111222333";
            const bsnQuerySnapshot = { empty: false }; // Simulating that BSN exists
            // Mocking the logic to check BSN (simulate the logic you use in the page)
            if (!bsnQuerySnapshot.empty) {
                cy.on("window:alert", (str) => {
                    expect(str).to.equal("BSN already taken. Please use a different BSN.");
                });
            }
        });

        // Fill out the form with an existing BSN
        cy.get('input[placeholder="Enter naam"]').type("Jake Smith");
        cy.get('input[placeholder="Enter email"]').type("jake.smith@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("111222333"); // Existing BSN
        cy.get("select").eq(0).select("managment");
        cy.get("select").eq(1).select("Admin");

        // Generate password
        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Assert BSN conflict error
        cy.on("window:alert", (str) => {
            expect(str).to.equal("BSN already taken. Please use a different BSN.");
        });
    });
});
