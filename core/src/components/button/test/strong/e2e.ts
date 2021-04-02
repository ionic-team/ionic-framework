describe('button: strong', () => {
  beforeEach(() => {
    cy.visit('components/button/test/strong?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
