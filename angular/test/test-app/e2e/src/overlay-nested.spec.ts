describe('Overlay: Nested', () => {
  beforeEach(() => {
    cy.visit('/overlay-nested');
  });

  it('should dismiss the top overlay', () => {
    cy.get('#action-button').click();

    cy.get('ion-modal').should('exist').should('be.visible');

    cy.get('#dismiss-button').click();
    cy.get('ion-modal').should('not.exist');

    cy.get('h1').should('have.text', 'Overlay Nested Page');
  });

});
