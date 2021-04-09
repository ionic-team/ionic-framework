describe('fab: translucent', () => {
  beforeEach(() => {
    cy.visit('components/fab/test/translucent?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-fab').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
