describe("Add User Component", () => {
    beforeEach(() => {
        // Mock the user context by directly setting the mock user in localStorage
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
            .should("have.length", 3) // Includes "Select a team"
            .then((options) => {
                const values = [...options].map((o) => o.textContent);
                expect(values).to.include("managment");
                expect(values).to.include("ICT");
            });
    });

    it("should successfully add a user with a valid email and BSN", () => {
        // Fill out the form with valid data
        cy.get('input[placeholder="Enter naam"]').type("John Doe");
        cy.get('input[placeholder="Enter email"]').type("john.doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("111222333"); // Valid BSN
        cy.get("select").eq(0).select("managment");
        cy.get("select").eq(1).select("Admin");

        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the create user request to finish

    });

    it("should show an error if email is already taken", () => {

        // Fill out the form with an existing email
        cy.get('input[placeholder="Enter naam"]').type("John Doe");
        cy.get('input[placeholder="Enter email"]').type("john.doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("111222333"); // Valid BSN
        cy.get("select").eq(0).select("ICT");
        cy.get("select").eq(1).select("User");

        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the email check request to finish

        // Assert email conflict error
        cy.on("window:alert", (str) => {
            expect(str).to.equal("Email already taken. Please use a different email.");
        });
    });

    it("should show an error for invalid BSN numbers", () => {
        // Fill out the form with an invalid BSN
        cy.get('input[placeholder="Enter naam"]').type("Jess Doe");
        cy.get('input[placeholder="Enter email"]').type("Jess.Doe@example.com");
        cy.get('input[placeholder="Enter BSN number"]').type("000000012"); // Invalid BSN
        cy.get("select").eq(0).select("ICT");
        cy.get("select").eq(1).select("User");

        cy.get("button").contains("Generate Password").click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Assert BSN error message
        cy.on("window:alert", (str) => {
            expect(str).to.equal("Invalid BSN number. Please enter a valid BSN.");
        });
    });
});
