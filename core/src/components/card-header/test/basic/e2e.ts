describe('card-header: basic', () => {
  beforeEach(() => {
    cy.visit('components/card-header/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-card-header').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
