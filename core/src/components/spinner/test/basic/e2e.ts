describe('spinner: basic', () => {
  beforeEach(() => {
    cy.visit('components/spinner/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-spinner').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
