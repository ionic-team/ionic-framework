/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Visit a cypress url based on the document direction
     * @example
     * cy.goToUrl('fab', 'basic', true);
     */
    goToUrl(component: string, test: string, rtl: boolean): Chainable<any>
  }
}
