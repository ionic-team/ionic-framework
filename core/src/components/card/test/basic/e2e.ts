describe('card: basic', () => {
  beforeEach(() => {
    cy.visit('components/card/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-card').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
