describe('progress-bar: standalone', () => {
  beforeEach(() => {
    cy.visit('components/progress-bar/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-progress-bar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
