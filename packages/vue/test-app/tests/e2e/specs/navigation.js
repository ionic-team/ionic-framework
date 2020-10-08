describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/navigation');
  });

  it('should show root page', () => {
    cy.get('#open-nav-modal').click();
  });

  it('should push a page with props', () => {
    cy.get('#open-nav-modal').click();

    cy.get('#push-nav-child').click();

    cy.get('#nav-child-content').should('have.text', 'Custom Title');
  });
})
