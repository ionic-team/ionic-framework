describe('tab-bar: custom', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/custom?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });

  // TODO set up tabbing using Stencil spec test
});
