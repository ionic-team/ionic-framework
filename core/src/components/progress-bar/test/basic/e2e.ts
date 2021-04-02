describe('progress-bar: basic', () => {
  beforeEach(() => {
    cy.visit('components/progress-bar/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-progress-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
