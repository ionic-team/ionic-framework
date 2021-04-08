describe('tab-bar: translucent', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/translucent?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
