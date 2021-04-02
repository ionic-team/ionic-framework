describe('button: states', () => {
  beforeEach(() => {
    cy.visit('components/button/test/states?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
