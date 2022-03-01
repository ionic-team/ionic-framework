describe('IonInput', () => {
  beforeEach(() => {
    cy.visit('/components/input');
  });

  it('should display the input value from useState()', () => {
    cy.get('ion-input').type('123abc');
    cy.get('ion-input').should('have.value', '123');
  });

});
