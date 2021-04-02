describe('menu-toggle: button', () => {
  beforeEach(() => {
    cy.visit('components/menu-toggle/test/button?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-menu-toggle').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
