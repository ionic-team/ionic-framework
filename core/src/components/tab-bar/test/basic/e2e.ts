describe('tab-bar: basic', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
