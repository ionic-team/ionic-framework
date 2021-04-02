describe('grid: offsets', () => {
  beforeEach(() => {
    cy.visit('components/grid/test/offsets?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-grid').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
