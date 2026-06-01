describe('Tests for authentication module', () => {
  const baseUrl = Cypress.expose('baseUrl')

  context('Layout validations', () => {
    it('should display login form with email and password fields', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('#login-button').should('be.visible')
      })
    })

    it('should display register form with name, email and password fields', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('form').within(() => {
        cy.get('input#name').should('be.visible')
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('#register-button').should('be.visible')
      })
    })

    it('should display reset password form with email field', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)

      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
        cy.get('#reset-password-button').should('be.visible')
      })
    })

    it('should display update password form with password field', () => {
      cy.visit(`${baseUrl}/auth/update-password`)

      cy.get('form').within(() => {
        cy.get('input#password').should('be.visible')
        cy.get('#update-password-button').should('be.visible')
      })
    })
  })

  context('Required fields validation', () => {
    it('should validate login form email and password fields are required', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.get('form').within(() => {
        cy.get('input#email').should('have.attr', 'required')
        cy.get('input#password').should('have.attr', 'required')
      })
    })

    it('should validate register form name, email and password fields are required', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('form').within(() => {
        cy.get('input#name').should('have.attr', 'required')
        cy.get('input#email').should('have.attr', 'required')
        cy.get('input#password').should('have.attr', 'required')
      })
    })

    it('should validate reset password form email field is required', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)

      cy.get('form').within(() => {
        cy.get('input#email').should('have.attr', 'required')
      })
    })

    it('should validate update password form password field is required', () => {
      cy.visit(`${baseUrl}/auth/update-password`)

      cy.get('form').within(() => {
        cy.get('input#password').should('have.attr', 'required')
      })
    })
  })

  context('Authentication and registration flow', () => {
    it('should redirect to registration page when clicking on "Cadastre-se gratuitamente" link from login page', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.contains('Cadastre-se gratuitamente').click()
      cy.url().should('include', '/auth/register')
      cy.get('h2').should('contain', 'Crie sua conta')
      cy.get('form').within(() => {
        cy.get('input#name').should('be.visible')
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('#register-button').should('be.visible')
      })
    })

    it('should redirect to login page when clicking on "Fazer login" link from registration page', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.contains('Fazer login').click()
      cy.url().should('include', '/auth/login')
      cy.get('h2').should('contain', 'Bem-vindo de volta')
      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
        cy.get('input#password').should('be.visible')
        cy.get('#login-button').should('be.visible')
      })
    })

    it('should not register a user with invalid email format', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('invalid-email')
      cy.get('input#password').type('password123')
      cy.get('#register-button').click()
      cy.contains('Cadastro realizado! Verifique seu e-mail para confirmar.').should('not.be.visible')
    })

    it('should not register a user with required fields blank', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('#register-button').click()
      cy.contains('Cadastro realizado! Verifique seu e-mail para confirmar.').should('not.be.visible')
    })

    it('should not register a user with password shorter than 8 characters', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('validemail@example.com')
      cy.get('input#password').type('1234567')
      cy.get('#register-button').click()
      cy.contains('Cadastro realizado! Verifique seu e-mail para confirmar.').should('not.be.visible')
    })

    it('should register a user successfully with valid data', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('validemail@example.com')
      cy.get('input#password').type('password123')
      cy.get('#register-button').click()
      cy.contains('Cadastro realizado! Verifique seu e-mail para confirmar.').should('be.visible')
    })
  })
})