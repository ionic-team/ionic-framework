describe('Textarea', () => {
  beforeEach(() => cy.visit('/textarea'));

  it('should become valid', () => {
    cy.get('#status').should('have.text', 'INVALID');

    cy.get('ion-textarea').type('hello');

    cy.get('#status').should('have.text', 'VALID');
  });

  it('should update the form control value when typing', () => {
    cy.get('#value').contains(`"textarea": ""`);
    cy.get('ion-textarea').type('hello');

    cy.get('#value').contains(`"textarea": "hello"`);
  });
});
