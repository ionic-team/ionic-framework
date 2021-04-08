describe('spinner: standalone', () => {
  beforeEach(() => {
    cy.visit('components/spinner/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-spinner').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
