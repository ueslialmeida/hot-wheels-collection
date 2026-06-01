describe('Tests for authentication flow', () => {
  const baseUrl = Cypress.expose('baseUrl')

  context('Layout validations', () => {
    it('should display login form with email and password fields', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('input[type="submit"]').should('be.visible')
      })
    })

    it('should display register form with name, email and password fields', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('form').within(() => {
        cy.get('input#name').should('be.visible')
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('input[type="submit"]').should('be.visible')
      })
    })

    it('should display reset password form with email field', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)

      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
        cy.get('input[type="submit"]').should('be.visible')
      })
    })

    it('should display update password form with password field', () => {
      cy.visit(`${baseUrl}/auth/update-password`)

      cy.get('form').within(() => {
        cy.get('input#password').should('be.visible')
        cy.get('input[type="submit"]').should('be.visible')
      })
    })
  })
})