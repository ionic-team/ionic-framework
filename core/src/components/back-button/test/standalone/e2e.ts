describe('back-button: standalone', () => {
  beforeEach(() => {
    cy.visit('components/back-button/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-back-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
