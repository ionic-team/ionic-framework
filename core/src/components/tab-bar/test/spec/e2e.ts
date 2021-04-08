describe('tab-bar: spec', () => {
  beforeEach(() => {
    cy.visit('components/tab-bar/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-tab-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
