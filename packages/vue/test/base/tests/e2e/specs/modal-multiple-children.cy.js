describe('modal - multiple children', () => {
  it('should render a root .ion-page when passed multiple children', () => {
    cy.visit('/modal-multiple-children');

    cy.get('ion-button#show-modal').click();

    cy.get('ion-modal').should('be.visible');

    cy.get('ion-modal .ion-page').should('have.length', 1);
    cy.get('ion-modal .ion-page .child-content').should('have.length', 2);
  });
})
