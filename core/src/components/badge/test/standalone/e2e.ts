describe('badge: standalone', () => {
  beforeEach(() => {
    cy.visit('components/badge/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-badge').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
