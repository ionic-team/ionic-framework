describe('tabs: placements', () => {
  beforeEach(() => {
    cy.visit('components/tabs/test/placements?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tabs').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
