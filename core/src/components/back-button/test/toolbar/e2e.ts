describe('back-button: toolbar', () => {
  beforeEach(() => {
    cy.visit('components/back-button/test/toolbar?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-back-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
