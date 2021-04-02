describe('chip: standalone', () => {
  beforeEach(() => {
    cy.visit('components/chip/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-chip').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
