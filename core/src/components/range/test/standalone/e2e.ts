describe('range: standalone', () => {
  beforeEach(() => {
    cy.visit('components/range/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-range').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
