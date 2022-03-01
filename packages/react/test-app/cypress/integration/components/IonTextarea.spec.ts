describe('IonTextarea', () => {
  beforeEach(() => {
    cy.visit('/components/textarea');
  });

  it('should display the textarea value from useState()', () => {
    cy.get('ion-textarea').type('123abc');
    cy.get('ion-textarea').should('have.value', '123');
  });

});
