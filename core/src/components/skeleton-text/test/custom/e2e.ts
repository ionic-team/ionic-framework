describe('skeleton-text: custom', () => {
  beforeEach(() => {
    cy.visit('components/skeleton-text/test/custom?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-skeleton-text').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
