describe('content: basic', () => {
  beforeEach(() => {
    cy.visit('components/content/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-content').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
