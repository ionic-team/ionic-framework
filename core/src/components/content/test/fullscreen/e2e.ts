describe('content: fullscreen', () => {
  beforeEach(() => {
    cy.visit('components/content/test/fullscreen?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-content').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
