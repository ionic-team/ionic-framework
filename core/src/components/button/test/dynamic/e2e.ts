describe('button: dynamic', () => {
  beforeEach(() => {
    cy.visit('components/button/test/dynamic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
