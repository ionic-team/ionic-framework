describe('IonModal', () => {

  // Issue: https://github.com/ionic-team/ionic-framework/issues/25590
  it('should push a new IonCard when dismissed', () => {
    cy.visit('issue/ion-modal-conditional-sibling');

    cy.get('ion-card').should('have.length', 1);

    cy.get('ion-button').click();

    cy.get('ion-card').should('have.length', 2);
  });

  // Issue: https://github.com/ionic-team/ionic-framework/issues/25590
  it('should be conditionally rendered', () => {
    cy.visit('issue/ion-modal-conditional');

    cy.get('ion-modal').should('not.exist');
    cy.get('ion-button#renderModalBtn').click();

    cy.get('ion-modal').should('be.visible');

    cy.get('ion-button#dismissModalBtn').click();
    cy.get('ion-button#renderModalBtn').should('be.visible');

  });

});
