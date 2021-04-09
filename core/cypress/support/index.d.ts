/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Visit a test url with Cypress and pass in a direction
     * @example
     * cy.goToUrl('alert', 'standalone', 'ltr');
     * cy.goToUrl('fab', 'basic', 'rtl');
     */
    goToUrl(component: string, test: string, dir: string): Chainable<any>
  }
}
