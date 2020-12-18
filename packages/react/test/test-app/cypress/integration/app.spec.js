/// <reference types="Cypress" />
/* eslint-disable */

describe('Connectors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('.each() - iterate over an array of elements', () => {
    // https://on.cypress.io/each
    cy.get('ion-item').each(($el, index, $list) => {
      console.log($el, index, $list);
    });
  });
});
