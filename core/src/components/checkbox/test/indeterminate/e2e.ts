describe('checkbox: indeterminate', () => {
  beforeEach(() => {
    cy.visit('components/checkbox/test/indeterminate?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-checkbox').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
