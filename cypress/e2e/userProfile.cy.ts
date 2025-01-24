 describe("User Profile Page", () => {
    
  
    beforeEach(() => {
        // Mock user data
        const mockUser = {
            body: {
                uid: "test123",
                email: "test10@gmail.com",
                userName: "test10",
                role: "admin",
                team: "management",
                bsnNumber: "123456782",
              },
        };
        cy.window().then((win) => {
            win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
          });
        // Set mock user data in localStorage after visiting the page
        cy.visit("http://localhost:3000/Profile").then(() => {
          
        });
        cy.window().then((win) => {
            win.fetch("**/users/Fd6PrKgsfeXkzR0beXxHuuhuKr63");
          });
          
        // Mock Firebase Firestore response
        cy.intercept("GET", "**/users/Fd6PrKgsfeXkzR0beXxHuuhuKr63", (req) => {
          console.log("Intercepted request:", req);
          req.reply({
            body: {
              uid: "test123",
              email: "test10@gmail.com",
              userName: "test10",
              role: "admin",
              team: "management",
              bsnNumber: "123456782",
            },
          });
        }).as("getUser");
      
        // Wait for the intercepted request
        cy.wait("@getUser", { timeout: 10000 });
      });
      
  
    it("should display user data correctly", () => {
      // Check user details
      cy.contains("BSN").next().should("have.text", "*******789");
      cy.contains("Naam").next().should("have.text", "test10");
      cy.contains("Email").next().should("have.text", "test10@gmail.com");
      cy.contains("Geboorte").next().should("have.text", "Not set");
      cy.contains("Teams").next().should("have.text", "managment");
      cy.contains("Vakantiedagen 2024").next().should("have.text", "60/60");
    });
  
    it("should generate and copy TOTP secret", () => {
      // Click the generate TOTP secret button
      cy.contains("Generate TOTP Secret").click();
  
      // Verify the secret is displayed
      cy.get("p.font-mono").should("exist");
  
      // Copy the secret to the clipboard
      cy.contains("Copy to Clipboard").click();
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.match(/^[A-Z2-7]+=*$/); // Simple regex for TOTP secret format
        });
      });
    });
  
    it("should open and close the reset password popup", () => {
      // Open the reset password popup
      cy.contains("✏️").first().click(); // Assuming the first edit button is for password
      cy.get("form").should("exist").contains("Reset Password");
  
      // Close the popup
      cy.get("button").contains("Close").click();
      cy.get("form").should("not.exist");
    });
  
    it("should open and close the verify email popup", () => {
      // Open the verify email popup
      cy.contains("✏️").eq(1).click(); // Assuming the second edit button is for email
      cy.get("form").should("exist").contains("Verify Email");
  
      // Close the popup
      cy.get("button").contains("Close").click();
      cy.get("form").should("not.exist");
    });
});     