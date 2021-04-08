describe('skeleton-text: basic', () => {
  beforeEach(() => {
    cy.visit('components/skeleton-text/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-skeleton-text').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
