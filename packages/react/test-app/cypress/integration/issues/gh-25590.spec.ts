describe('IonModal with dynamic sibling elements', () => {
  beforeEach(() => {
    cy.visit('issue/ion-modal-conditional-sibling');
  });

  // Issue: https://github.com/ionic-team/ionic-framework/issues/25590
  it('should render new sibling elements', () => {
    cy.get('ion-card').should('have.length', 1);

    cy.get('ion-button').click();

    cy.get('ion-card').should('have.length', 2);
  });


});
