describe('Tests for the dashboard module', () => {
  
  const baseUrl = Cypress.expose('baseUrl')

  context('Dashboard layout validations', () => {
    it('should display the dashboard main element controls', () => {
        cy.login()
        cy.visit(`${baseUrl}/dashboard`)

        cy.get('h2').contains('Minha Garagem').should('be.visible')
        cy.contains(/Você tem \d+ carrinhos na coleção/).should('be.visible')
        cy.get('button').contains('Sair da Garagem').should('be.visible')
        cy.get('#car-list').should('be.visible')
    })
  })
})