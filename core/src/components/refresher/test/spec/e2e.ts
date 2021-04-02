describe('refresher: spec', () => {
  beforeEach(() => {
    cy.visit('components/refresher/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-refresher').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
