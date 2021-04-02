describe('button: anchor', () => {
  beforeEach(() => {
    cy.visit('components/button/test/anchor?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
