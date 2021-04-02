describe('back-button: basic', () => {
  beforeEach(() => {
    cy.visit('components/back-button/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-back-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
