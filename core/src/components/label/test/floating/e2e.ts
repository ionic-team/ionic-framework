describe('label: floating', () => {
  beforeEach(() => {
    cy.visit('components/label/test/floating?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-label').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
