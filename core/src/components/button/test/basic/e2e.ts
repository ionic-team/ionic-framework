describe('button: basic', () => {
  beforeEach(() => {
    cy.visit('components/button/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
