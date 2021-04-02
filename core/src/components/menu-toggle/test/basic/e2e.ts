describe('menu-toggle: basic', () => {
  beforeEach(() => {
    cy.visit('components/menu-toggle/test/basic?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-menu-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
