describe('card: standalone', () => {
  beforeEach(() => {
    cy.visit('components/card/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-card').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
