describe('fab-button: standalone', () => {
  beforeEach(() => {
    cy.visit('components/fab-button/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-fab-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
