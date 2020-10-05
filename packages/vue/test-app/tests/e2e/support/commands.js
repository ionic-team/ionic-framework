// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('ionSwipeToGoBack', (complete = false) => {
  cy.get('ion-router-outlet')
    .trigger('mousedown', { position: "left" })
    .trigger('mousemove', { clientX: (complete) ? 100 : 300, clientY: 275 })
    .trigger('mouseup', { force: true })
  cy.wait(150);
})

Cypress.Commands.add('ionPageVisible', (pageId) => {
  cy.get(`.ion-page[data-pageid=${pageId}]`)
    .should('not.have.class', 'ion-page-hidden')
    .should('not.have.class', 'ion-page-invisible')
    .should('have.length', 1)
})

Cypress.Commands.add('ionPageInvisible', (pageId) => {
  cy.get(`div.ion-page[data-pageid=${pageId}]`)
    .should('have.class', 'ion-page-invisible')
    .should('have.length', 1)
})

Cypress.Commands.add('ionBackClick', (pageId) => {
  cy.get(`div.ion-page[data-pageid=${pageId}]`)
    .should('be.visible', true)
    .find('ion-back-button')
    .click()
});
