describe('label: standalone', () => {
  beforeEach(() => {
    cy.visit('components/label/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-label').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
