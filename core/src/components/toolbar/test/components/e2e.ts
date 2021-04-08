describe('toolbar: components', () => {
  beforeEach(() => {
    cy.visit('components/toolbar/test/components?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-toolbar').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
