describe('grid: standalone', () => {
  beforeEach(() => {
    cy.visit('components/grid/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-grid').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
