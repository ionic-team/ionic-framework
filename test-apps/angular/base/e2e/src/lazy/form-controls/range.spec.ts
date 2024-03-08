describe('Form Controls: Range', () => {

  beforeEach(() => {
    cy.visit('/lazy/form-controls/range');
  });

  it('should have form control initial value', () => {
    // Cypress does not support checking numeric values of custom elements
    // see: https://github.com/cypress-io/cypress/blob/bf6560691436a5a953f7e03e0ea3de38f3d2a632/packages/driver/src/dom/elements/elementHelpers.ts#L7
    cy.get('ion-range').invoke('prop', 'value').should('eq', 5);
  });

  it('should reflect Ionic form control status classes', () => {
    // Control is initially invalid
    cy.get('ion-range').should('have.class', 'ion-invalid');
    cy.get('ion-range').should('have.class', 'ion-pristine');
    cy.get('ion-range').should('have.class', 'ion-untouched');

    // Cypress does not support typing unless the element is focusable.
    cy.get('ion-range').shadow()
      .find('.range-knob-handle')
      .click()
      .focus()
      .type('{rightarrow}'.repeat(5));

    cy.get('ion-range').should('have.class', 'ion-valid');
    cy.get('ion-range').should('have.class', 'ion-dirty');
    cy.get('ion-range').should('have.class', 'ion-touched');
    cy.get('ion-range').invoke('prop', 'value').should('eq', 10);
  });

});
