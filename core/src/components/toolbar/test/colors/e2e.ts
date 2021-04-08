describe('toolbar: colors', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/colors?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
