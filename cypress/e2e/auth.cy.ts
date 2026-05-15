describe('template spec', () => {
  it('should see the login page', () => {
    cy.visit('http://localhost:3000')
    cy.get('h2').should('contain.text', 'Bem-vindo de volta')
  })

  it('should create an account', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('#name').type('Uesli Almeida')
    cy.get('#email').type('almeida.uesli@gmail.com')
    cy.get('#password').type('12345678')
    cy.get('#register').click()

    cy.url().should('include', '/login')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
  })

  it('should login with the new account', () => {
    cy.visit('http://localhost:3000')
    cy.get('#email').type('almeida.uesli@gmail.com')
    cy.get('#password').type('12345678')
    cy.get('#login').click()

    cy.url().should('include', '/dashboard')
    cy.get('h1').should('contain.text', 'Minha Garagem')
  })
})