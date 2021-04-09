describe('fab: standalone', () => {
  beforeEach(() => {
    cy.visit('components/fab/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-fab').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
