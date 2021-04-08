describe('toolbar: spec', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/spec?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
