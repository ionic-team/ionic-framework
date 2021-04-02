describe('checkbox: basic', () => {
  beforeEach(() => {
    cy.visit('components/checkbox/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-checkbox').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
