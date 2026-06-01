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
      cy.wait(500)

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
      cy.wait(500)

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

      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should not register a user with required fields blank', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.removeRequiredAttribute(['input#name', 'input#email', 'input#password'])

      cy.get('#register-button').click()

      cy.contains('Por favor, preencha todos os campos.').should('be.visible')
    })

    it('should not register a user with password shorter than 8 characters', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('validemail@example.com')
      cy.get('input#password').type('1234567')
      cy.get('#register-button').click()

      cy.contains('A senha deve ter pelo menos 8 caracteres.').should('be.visible')
    })

    it('should not register a user with a duplicated email', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('autotester@localhost.com')  
      cy.get('input#password').type('password123')
      cy.get('#register-button').click()

      cy.contains('Este e-mail já está em uso.').should('be.visible')
    })

    it('should register a user successfully with valid data', () => {
      cy.visit(`${baseUrl}/auth/register`)

      cy.get('input#name').type('John Doe')
      cy.get('input#email').type('validemail@example.com')
      cy.get('input#password').type('password123')
      cy.get('#register-button').click()

      cy.contains('Cadastro realizado! Verifique seu e-mail para confirmar.').should('be.visible')
    })

    it('should display error message if email field is empty', () => {
      cy.visit(`${baseUrl}/auth/login`)
      cy.removeRequiredAttribute(['input#email'])

      cy.get('input#password').type('password123')
      cy.get('#login-button').click()

      cy.contains('Por favor, preencha todos os campos.').should('be.visible')
    })

    it('should display error message if password field is empty', () => {
      cy.visit(`${baseUrl}/auth/login`)
      cy.removeRequiredAttribute(['input#password'])

      cy.get('input#email').type('validemail@example.com')
      cy.get('#login-button').click()

      cy.contains('Por favor, preencha todos os campos.').should('be.visible')
    })

    it('should not accept invalid email format', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.get('input#email').type('invalid-email')
      cy.get('input#password').type('password123')
      cy.get('#login-button').click()

      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should not login when invalid credentials are provided', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.get('input#email').type('invaliduser@localhost.com')
      cy.get('input#password').type('password123')
      cy.get('#login-button').click()

      cy.contains('E-mail ou senha incorretos.').should('be.visible')
    })

    it('should login successfully when valid credentials are provided', () => {
      cy.login()

      cy.url().should('eq', `${baseUrl}/dashboard`)
      cy.contains('Minha Garagem').should('be.visible')
    })
  })

  context('Password reset/update flow', () => {
    it('should redirect to password recovery page when clicking on "Esqueceu a senha?" link from login page', () => {
      cy.visit(`${baseUrl}/auth/login`)

      cy.contains('Esqueceu a senha?').click()
      cy.wait(500)
      cy.url().should('include', '/auth/reset-password')
      cy.get('h2').should('contain', 'Redefinir Senha')

      cy.get('form').within(() => {
        cy.get('input#email').should('be.visible')
      })
    })

    it('should not submit reset password form with invalid email', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)

      cy.get('input#email').type('invalid-email')
      cy.get('#reset-password-button').click()

      cy.get('input[type="email"]:invalid').should('exist');
    })

    it('should not submit reset password form with blank email field', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)
      
      cy.removeRequiredAttribute(['input#email'])

      cy.get('#reset-password-button').click()

      cy.contains('Por favor, preencha o campo de e-mail.').should('be.visible')
    })

    it('should submit reset password form when valid email is provided', () => {
      cy.visit(`${baseUrl}/auth/reset-password`)
      
      cy.get('input#email').type('autotester@localhost.com')
      cy.get('#reset-password-button').click()

      cy.contains('Link para redefinição de senha enviado.').should('be.visible')
    })

    it('should not update password with invalid reset token', () => {
      cy.visit(`${baseUrl}/auth/update-password`)
      
      cy.get('input#password').type('password123')
      cy.get('#update-password-button').click()

      cy.contains('Erro ao atualizar senha.').should('be.visible')
    })

    it('should not reset password when password field is empty', () => {
      cy.visit(`${baseUrl}/auth/update-password`)
      
      cy.removeRequiredAttribute(['input#password'])
      cy.get('#update-password-button').click()

      cy.contains('Por favor, preencha o campo de senha.').should('be.visible')
    })

    it('should not accept password shorter than 8 characters', () => {
      cy.visit(`${baseUrl}/auth/update-password`)
      
      cy.get('input#password').type('1234567')
      cy.get('#update-password-button').click()

      cy.contains('A senha deve ter pelo menos 8 caracteres.').should('be.visible')
    })
  })
})