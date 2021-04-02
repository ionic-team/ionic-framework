describe('grid: basic', () => {
  beforeEach(() => {
    cy.visit('components/grid/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-grid').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
