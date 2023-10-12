describe('Menu Controller', () => {
  beforeEach(() => {
    cy.visit('/standalone/menu-controller');
  })

  it('should register menus correctly', () => {
    cy.get('#set-menu-count').click();
    cy.get('#registered-menu-count').should('have.text', '1');
  });
})
