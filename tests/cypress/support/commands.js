/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', () => {
    const baseUrl = Cypress.expose('baseUrl')
    const loginUrl = `${baseUrl}/auth/login`
    const userEmail = Cypress.expose('userEmail')
    const userPassword = Cypress.expose('userPassword')

    if (!userEmail || !userPassword) {
        throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in environment variables')
    }
    
    cy.visit(loginUrl)

    cy.get('#email').type(userEmail)
    cy.get('#password').type(userPassword)

    cy.get('#login-button').click()
    cy.wait(500)
})

Cypress.Commands.add('removeRequiredAttribute', (elements) => {
    elements.forEach(element => {
        cy.get(element).invoke('removeAttr', 'required')
    })
})

Cypress.Commands.add('addNewCar', (car) => {
    cy.get('#add-new-car').click()
    cy.get('#model-name').type(car.model)
    cy.get('#model-code').type(car.modelCode)
    cy.get('#collection-year').type(car.year)
    cy.get('#serie').type(car.series)
    cy.get('#color').type(car.color)
    cy.get('#number-in-year-collection').type(car.numInCollection)
    cy.get('#number-in-serie').type(car.numInSeries)
    car.imageUrl && cy.get('#image-url').type(car.imageUrl, {delay: 0})
    cy.get('#save').click()
})

Cypress.Commands.add('deleteCarFromCollection', () => {
    cy.visit(`${Cypress.expose('baseUrl')}/dashboard`)
    cy.get('#car-list').find('button').contains('Editar Registro').click()
    cy.wait(500)
    cy.get('#delete').click()
    cy.wait(500)
    cy.get('#confirm-delete').click()
    cy.wait(500)
})
