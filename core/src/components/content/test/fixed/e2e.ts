describe('content: fixed', () => {
  beforeEach(() => {
    cy.visit('components/content/test/fixed?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-content').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
