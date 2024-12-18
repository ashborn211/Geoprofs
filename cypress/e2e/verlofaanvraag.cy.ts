describe('template spec', () => {
  it('passes', () => {
    cy.intercept('GET', '/api/user', {
      statusCode: 200,
      body: {name: 'Velipan', email: 'velipan@gmail.com' },
    });    
    cy.visit('http://localhost:3000/home')
  })
})