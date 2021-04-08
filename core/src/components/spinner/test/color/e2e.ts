describe('spinner: color', () => {
  beforeEach(() => {
    cy.visit('components/spinner/test/color?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-spinner').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
