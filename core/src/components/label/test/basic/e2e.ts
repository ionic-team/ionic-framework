describe('label: basic', () => {
  beforeEach(() => {
    cy.visit('components/label/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-label').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
