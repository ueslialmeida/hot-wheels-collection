describe('Tests for general routes and redirects', () => {
    const baseUrl = Cypress.expose('baseUrl')

    it('should redirect authenticated users from /auth/login to /dashboard', () => {
        cy.login()

        cy.visit(`${baseUrl}/auth/login`)

        // After login, visiting the login page should redirect to dashboard
        cy.url().should('eq', `${baseUrl}/dashboard`)
    })

    it('should redirect authenticated users from /auth/register to /dashboard', () => {
        cy.login()

        cy.visit(`${baseUrl}/auth/register`)

        // After login, visiting the register page should redirect to dashboard
        cy.url().should('eq', `${baseUrl}/dashboard`)
    })

    it('should redirect authenticated users from /auth/reset-password to /dashboard', () => {
        cy.login()

        cy.visit(`${baseUrl}/auth/reset-password`)

        // After login, visiting the reset password page should redirect to dashboard
        cy.url().should('eq', `${baseUrl}/dashboard`)
    })

    it('should redirect anonymous users from /dashboard to /auth/login', () => {
        cy.visit(`${baseUrl}/dashboard`)

        // Anonymous users visiting the dashboard should be redirected to login
        cy.url().should('eq', `${baseUrl}/auth/login`)
    })
})