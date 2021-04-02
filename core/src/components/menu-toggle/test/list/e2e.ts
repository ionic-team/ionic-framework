describe('menu-toggle: list', () => {
  beforeEach(() => {
    cy.visit('components/menu-toggle/test/list?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-menu-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
