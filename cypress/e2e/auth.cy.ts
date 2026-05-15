describe('template spec', () => {
  it('should see the login page', () => {
    cy.visit('http://localhost:3000')
    cy.get('h2').should('contain.text', 'Bem-vindo de volta')
  })

  it('should create an account and auto-login', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('#name').type('Uesli Almeida')
    cy.get('#email').type('almeida.uesli@gmail.com')
    cy.get('#password').type('12345678')
    cy.get('#register').click()

    cy.get('h2').should('contain.text', 'Minha Garagem')
    cy.get('p').should('contain.text', /Você tem \d carrinhos na coleção/)
  })
})