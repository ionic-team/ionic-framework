describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('/standalone/tabs');
  });

  it('should render the active tab', () => {
    cy.get('#tab-button-tab-one').click();
    cy.get('app-tab-one').should('be.visible');
    cy.contains('Tab 1');
  });
});
