describe('IonSearchbar', () => {
  beforeEach(() => {
    cy.visit('/components/searchbar');
  });

  it('should display the searcbar value from useState()', () => {
    cy.get('ion-searchbar').type('123abc');
    cy.get('ion-searchbar').should('have.value', '123');
  });

});
