describe("nav test", () => {
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
        it("should display the navigation bar", () => {
          cy.get("nav").should("be.visible"); // Adjust the selector if needed
        });
      
        it("should navigate to the profile page when the profile button is clicked", () => {
            cy.get('a[href="Profile"]').click();
            cy.url().should("include", "/Profile");
        });
      
        it("should show the admin button only for admins and navigate correctly", () => {
          cy.get("body").then(($body) => {
            if ($body.find("button:contains('Admin Action')").length > 0) {
              cy.get("button").contains("Admin Action").click();
              cy.url().should("include", "/admiin"); // Ensure correct admin page navigation
            } else {
              cy.log("Admin button is not visible for non-admin users.");
            }
          });
        });
      });
      