/// <reference types="cypress" />

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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('ionPageVisible', (pageId) => {
  // cy.get(`div.ion-page[data-pageid=${pageId}]`)
  //   .should('exist')
  //   .should('not.have.class', 'ion-page-hidden')
  //   .should('not.have.class', 'ion-page-visible')

  cy.get(`div.ion-page[data-pageid=${pageId}]`)
    .should('not.have.class', 'ion-page-hidden')
    .should('not.have.class', 'ion-page-invisible')
    .should('have.length', 1);

  // cy.get(`div.ion-page[data-pageid=${pageId}]`)
  //   .should('not.have.class', 'ion-page')
  //   .should('have.length', 1)
  // .not('')
  // .should('have.length', 1)

  // cy.get(`div.ion-page[data-pageid=${pageId}]`).should('not.have.class', 'ion-page-visible')
  // cy.get(`div.ion-page[data-pageid=${pageId}]`).should('have.attr', 'style', 'z-index: 101;')
});

Cypress.Commands.add('ionPageHidden', (pageId) => {
  cy.get(`div.ion-page[data-pageid=${pageId}]`)
    .should('have.class', 'ion-page-hidden')
    .should('have.length', 1);
});

Cypress.Commands.add('ionPageDoesNotExist', (pageId) => {
  cy.get(`div.ion-page[data-pageid=${pageId}]`).should('not.exist');
});

Cypress.Commands.add('ionNav', (element, contains) => {
  cy.contains(element, contains).click();
  cy.wait(250);
});

Cypress.Commands.add('ionSwipeToGoBack', (complete = false, selector = 'ion-router-outlet') => {
  const increment = (complete) ? 60 : 5;
  cy.get(selector)
    .first()
    .trigger('mousedown', 0, 275, { which: 1, force: true })
    .trigger('mousemove', increment * 1, 275, { which: 1, force: true })
    .wait(25)
    .trigger('mousemove', increment * 2, 275, { which: 1, force: true })
    .wait(25)
    .trigger('mousemove', increment * 3, 275, { which: 1, force: true })
    .wait(25)
    .trigger('mousemove', (complete) ? increment * 4 : increment * 0, 275, { which: 1, force: true })
    .trigger('mouseup', (complete) ? increment * 4 : increment * 0, 275, { which: 1, force: true })
  cy.wait(150);
})

Cypress.Commands.add('ionMenuNav', (contains) => {
  // cy.get('ion-menu.show-menu').should('exist');
  // cy.wait(1000)
  cy.contains('ion-item', contains).click({ force: true });
  // cy.get('div.ion-page').click();
  // cy.get('ion-menu').then(menu => {
  //   cy.wait(1000)
  //   menu[0].isOpen(open => {
  //     if(open) {
  //       menu[0].toggle()
  //     }
  //     cy.get('ion-menu.show-menu').should('not.exist');
  //   })
  // })
  // cy.get('ion-menu.show-menu').should('not.exist');

  // cy.wait(1000)
  // cy.wait(1000)
  // cy.contains('ion-item', contains).click()
  // cy.contains('ion-item', contains).parent('ion-menu-toggle').click({ force: true });
});

Cypress.Commands.add('ionTabClick', (tabText) => {
  // TODO FW-2800: figure out how to get rid of this wait. Switching tabs after a forward nav to a details page needs it
  cy.wait(500);
  cy.contains('ion-tab-button', tabText).click({ force: true });
  // cy.get('ion-tab-button.tab-selected').contains(tabText)
});

Cypress.Commands.add('ionBackClick', (pageId) => {
  cy.get(`div.ion-page[data-pageid=${pageId}]`)
    .should('be.visible', true)
    // .should('have.length', 1)
    .find('ion-back-button')
    .click();
});

Cypress.Commands.add('ionMenuClick', () => {
  // Todo: figure out how to get menu to close
  // cy.get(`div.ion-page[aria-hidden!=true]`)
  //   .should('have.length', 1)
  //   .find('ion-menu-button')
  //   .click()
  // cy.get('ion-menu.show-menu').should('exist');
});

Cypress.Commands.add('ionHardwareBackEvent', () => {
  cy.document().trigger('backbutton');
});
