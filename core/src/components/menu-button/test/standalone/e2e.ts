describe('menu-button: standalone', () => {
  beforeEach(() => {
    cy.visit('components/menu-button/test/standalone?ionic:_testing=true');
  })

  it('should render', () => {
    cy.get('ion-menu-button').should('have.class', 'hydrated');

    // cy.screenshot();
  });
});
