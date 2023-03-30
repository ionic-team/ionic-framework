describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/navigation');
  });

  it('should push a page with props', () => {
    cy.get('#open-nav-modal').click();

    cy.get('#push-nav-child').click();

    cy.get('#nav-child-content').should('have.text', 'Custom Title');
  });
});
