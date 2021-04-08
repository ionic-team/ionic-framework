describe('toolbar: standalone', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
