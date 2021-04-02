describe('button: expand', () => {
  beforeEach(() => {
    cy.visit('components/button/test/expand?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
