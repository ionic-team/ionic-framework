describe('toggle: standalone', () => {
  beforeEach(() => {
    cy.visit('components/toggle/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
