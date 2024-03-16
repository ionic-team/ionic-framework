describe('RouterLink', () => {
  beforeEach(() => {
    cy.visit('/standalone/router-link');
  });
  
  it('should mount the root component', () => {
    cy.ionPageVisible('app-router-link');

    cy.contains('I\'m a link');
  });

  it('should go to /standalone/popover using an anchor', () => {
    // click on the anchor
    cy.get('a').contains('I\'m a link').click();

    cy.url().should('include', '/standalone/popover');
  });

  it('should go to /standalone/popover using a button', () => {
    cy.get('button').contains('I\'m a button').click();

    cy.url().should('include', '/standalone/popover');
  });
});
