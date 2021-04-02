describe('menu-button: basic', () => {
  beforeEach(() => {
    cy.visit('components/menu-button/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-menu-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
