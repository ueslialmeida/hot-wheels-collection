describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('h2').should('contain.text', 'Bem-vindo de volta')
  })
})