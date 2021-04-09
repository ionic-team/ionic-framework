describe('fab: states', () => {
  beforeEach(() => {
    cy.visit('components/fab/test/states?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-fab').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
