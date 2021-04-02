describe('grid: padding', () => {
  beforeEach(() => {
    cy.visit('components/grid/test/padding?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-grid').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
