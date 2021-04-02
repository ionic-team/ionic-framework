describe('checkbox: standalone', () => {
  beforeEach(() => {
    cy.visit('components/checkbox/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-checkbox').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
