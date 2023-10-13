describe('Menu Controller', () => {
  beforeEach(() => {
    cy.visit('/standalone/menu-controller');
  })

  // https://github.com/ionic-team/ionic-framework/issues/28337
  it('should register menus correctly', () => {
    cy.get('#set-menu-count').click();
    cy.get('#registered-menu-count').should('have.text', '1');
  });
})
