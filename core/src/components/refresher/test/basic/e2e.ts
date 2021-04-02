describe('refresher: basic', () => {
  beforeEach(() => {
    cy.visit('components/refresher/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-refresher').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
