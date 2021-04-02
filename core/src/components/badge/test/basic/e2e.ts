describe('badge: basic', () => {
  beforeEach(() => {
    cy.visit('components/badge/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-badge').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
