describe('Searchbar', () => {
  beforeEach(() => cy.visit('/searchbar'));

  it('should become valid', () => {
    cy.get('#status').should('have.text', 'INVALID');

    cy.get('ion-searchbar').type('hello');

    cy.get('#status').should('have.text', 'VALID');
  });

  it('should update the form control value when typing', () => {
    cy.get('#value').contains(`"searchbar": ""`);
    cy.get('ion-searchbar').type('hello');

    cy.get('#value').contains(`"searchbar": "hello"`);
  });
});