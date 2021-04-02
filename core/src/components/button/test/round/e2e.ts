describe('button: round', () => {
  beforeEach(() => {
    cy.visit('components/button/test/round?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
