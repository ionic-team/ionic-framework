describe('content: standalone', () => {
  beforeEach(() => {
    cy.visit('components/content/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-content').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
