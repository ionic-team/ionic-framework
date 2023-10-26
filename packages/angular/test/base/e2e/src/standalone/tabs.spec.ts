describe('Tabs', () => {
  beforeEach(() => {
    cy.visit('/standalone/tabs');
  });

  it('should redirect to the default tab', () => {
    cy.get('app-tab-one').should('be.visible');
    cy.contains('Tab 1');
  });

  it('should render new content when switching tabs', () => {
    cy.get('#tab-button-tab-two').click();
    cy.get('app-tab-two').should('be.visible');
    cy.contains('Tab 2');
  });

  it('parentOutlet should be defined', () => {
    cy.get('#parent-outlet span').should('have.text', 'true');
  });
});
