describe('list-header: spec', () => {
  beforeEach(() => {
    cy.visit('components/list-header/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-list-header').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
