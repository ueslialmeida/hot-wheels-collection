describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('h2').should('contain.text', 'Bem-vindo de volta')
  })
})