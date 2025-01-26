describe('Team User Table', () => {
    beforeEach(() => {
        // Set a mock user in local storage
        const mockUser = {
            uid: "test123",
            email: "test10@gmail.com",
            userName: "Test Admin",
            role: "Admin",
            team: "managment",
        };

        cy.window().then((win) => {
            win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
        });

        // Visit the page where the Team User Table component is rendered
        cy.visit("http://localhost:3000/admiin/show-teams"); // Adjust the path as necessary
    });

    it('displays loading message initially', () => {
        cy.get('.text-blue-600').contains('Loading teams and users...');
    });

    it('displays users grouped by their respective teams', () => {
        // Mock Firestore response for teams and users
        cy.intercept('GET', '**/Team', {
            statusCode: 200,
            body: [
                {
                    id: 'team1',
                    teamName: 'ICT',
                    users: [
                        { id: '6wfLdlKYgObKqlenHWAC2BQWGo63', userName: 'test2222', email: 'test2222@gmail.com', role: 'user' },
                        { id: 'KuBkRf3F18d42Wqkt13Bo4PVDJ53', userName: 'testbsn2137', email: 'testbsn2137@gmail.com', role: 'user' },
                    ],
                },
                {
                    id: 'team2',
                    teamName: 'managment',
                    users: [
                        { id: '7ZmYdwy3jnUQGz9maoXd9PyQR8O2', userName: '4534', email: 'florian123@gmail.com', role: 'user' },
                        { id: 'Aay3C4lNLZQ3uogNDcApVJEYaGd2', userName: 'test', email: 'test1@gmail.com', role: 'admin' },
                    ],
                },
            ],
        });

        // Assert that teams and users are displayed correctly
        cy.contains('ICT').should('be.visible'); // Check for team name
        cy.contains('managment').should('be.visible');

        // Check users under "ICT"
        cy.get('h2').contains('ICT').parent().within(() => {
            cy.contains('test2222').should('be.visible');
            cy.contains('testbsn2137').should('be.visible');
        });

        // Check users under "Management"
        cy.get('h2').contains('managment').parent().within(() => {
            cy.contains('4534').should('be.visible');
            cy.contains('test').should('be.visible');
        });
    });
});
