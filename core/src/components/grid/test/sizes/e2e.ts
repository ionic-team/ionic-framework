describe('grid: sizes', () => {
  beforeEach(() => {
    cy.visit('components/grid/test/sizes?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-grid').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
