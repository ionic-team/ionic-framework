describe('button: outline', () => {
  beforeEach(() => {
    cy.visit('components/button/test/outline?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
