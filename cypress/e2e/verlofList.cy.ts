//Door je boy Florian
describe("Verlof List Page", () => {
    beforeEach(() => {
        cy.mockLogin({
            uid: "123456",
            email: "test@example.com",
            userName: "Test User",
            role: "admin",
            team: "test-team",
        });

        cy.visit("http://localhost:3000/admiin/show-verlof");
    });

    it("should render the dropdown and update the verlof list based on the selected status", () => {
        // Controleer of de dropdown zichtbaar is en de juiste opties bevat
        cy.get("select")
            .should("be.visible")
            .within(() => {
                cy.contains("In behandeling");
                cy.contains("Goedgekeurd");
                cy.contains("Afgekeurd");
            });

        // Selecteer 'Goedgekeurd' en controleer de verlof status
        cy.get("select").select("2");
        cy.wait(500); // Wacht tot de lijst wordt bijgewerkt
        cy.get("tbody tr").each(($row) => {
            cy.wrap($row)
                .within(() => {
                    cy.get("td").eq(4).should("contain.text", "Goedgekeurd");
                });
        });

        // Selecteer 'Afgekeurd' en controleer de verlof status
        cy.get("select").select("3");
        cy.wait(500);
        cy.get("tbody tr").each(($row) => {
            cy.wrap($row)
                .within(() => {
                    cy.get("td").eq(4).should("contain.text", "Afgekeurd");
                });
        });

        // Selecteer 'In behandeling' en controleer de verlof status
        cy.get("select").select("1");
        cy.wait(500);
        cy.get("tbody tr").each(($row) => {
            cy.wrap($row).within(() => {
                cy.get("td").eq(4).should("contain.text", "In behandeling");

                // Gebruik scrollIntoView om de knoppen zichtbaar te maken
                cy.get("button")
                    .contains("Afkeuren")
                    .scrollIntoView()
                    .should("be.visible");

                cy.get("button")
                    .contains("Goedkeuren")
                    .scrollIntoView()
                    .should("be.visible");
            });
        });
    });
});
