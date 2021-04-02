describe('button: toolbar', () => {
  beforeEach(() => {
    cy.visit('components/button/test/toolbar?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
