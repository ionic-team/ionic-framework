describe('textarea: standalone', () => {
  beforeEach(() => {
    cy.visit('components/textarea/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-textarea').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
