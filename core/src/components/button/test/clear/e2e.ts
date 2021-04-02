describe('button: clear', () => {
  beforeEach(() => {
    cy.visit('components/button/test/clear?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
