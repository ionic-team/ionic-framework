describe('chip: basic', () => {
  beforeEach(() => {
    cy.visit('components/chip/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-chip').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
