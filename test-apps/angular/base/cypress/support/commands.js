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

Cypress.Commands.add('ionSwipeToGoBack', (complete = false, selector = 'ion-router-outlet') => {
  const increment = complete ? 60 : 25;
  cy.get(selector)
    .first()
    .trigger('mousedown', 0, 275, { which: 1, force: true })
    .trigger('mousemove', increment * 1, 275, { which: 1, force: true })
    .wait(50)
    .trigger('mousemove', increment * 2, 275, { which: 1, force: true })
    .wait(50)
    .trigger('mousemove', increment * 3, 275, { which: 1, force: true })
    .wait(50)
    .trigger('mousemove', increment * 4, 275, { which: 1, force: true })
    .wait(50)
    .trigger('mouseup', increment * 4, 275, { which: 1, force: true });
  cy.wait(150);
});

/**
 * getStack is a query because it has automatic
 * retries built in which will let us account for
 * async routing without having to use
 * arbitrary cy.wait calls.
 */
Cypress.Commands.addQuery('getStack', (selector) => {
  return () => {
    const el = cy.$$(selector);
    return Array.from(el.children()).map((el) => el.tagName.toLowerCase());
  }
});

Cypress.Commands.add('testStack', (selector, expected) => {
  cy.getStack(selector).should('deep.equal', expected);
});

Cypress.Commands.add('testLifeCycle', (selector, expected) => {
  cy.get(`${selector} #ngOnInit`).invoke('text').should('equal', '1');
  cy.get(`${selector} #ionViewWillEnter`).invoke('text').should('equal', expected.ionViewWillEnter.toString());
  cy.get(`${selector} #ionViewDidEnter`).invoke('text').should('equal', expected.ionViewDidEnter.toString());
  cy.get(`${selector} #ionViewWillLeave`).invoke('text').should('equal', expected.ionViewWillLeave.toString());
  cy.get(`${selector} #ionViewDidLeave`).invoke('text').should('equal', expected.ionViewDidLeave.toString());
});

Cypress.Commands.add('ionPageVisible', (selector) => {
  cy.get(selector)
    .should('have.class', 'ion-page')
    .should('not.have.class', 'ion-page-hidden')
    .should('not.have.class', 'ion-page-invisible')
    .should('have.length', 1);
});

Cypress.Commands.add('ionPageHidden', (selector) => {
  cy.get(selector).should('have.class', 'ion-page').should('have.class', 'ion-page-hidden').should('have.length', 1);
});

Cypress.Commands.add('ionPageDoesNotExist', (selector) => {
  cy.get(selector).should('not.exist');
});

Cypress.Commands.add('ionTabClick', (tabText) => {
  // TODO FW-2790: Figure out how to get rid of wait. It's a workaround for flakiness in CI.
  cy.wait(250);
  cy.contains('ion-tab-button', tabText).click({ force: true });
});
