describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/navigation');
  });

  it('should push a page with props', () => {
    cy.get('#open-nav-modal').click();

    cy.get('#push-nav-child').click();

    cy.get('#nav-child-content').should('have.text', 'Custom Title');
  });

  it('nav should support kebab-case root-params', () => {
    cy.get('#open-nav-modal').click();

    cy.get('#nav-root-params').should('have.text', 'Message: Hello World!');
  });
});
