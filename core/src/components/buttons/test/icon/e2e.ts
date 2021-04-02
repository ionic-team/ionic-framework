describe('buttons: icon', () => {
  beforeEach(() => {
    cy.visit('components/buttons/test/icon?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-buttons').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
