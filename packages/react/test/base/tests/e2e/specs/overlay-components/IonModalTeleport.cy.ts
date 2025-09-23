describe('IonModal: inline teleport with showBackdrop=false', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal-teleport');
  });

  it('should render and remain interactive when appended into a page container', () => {
    cy.get('#open-teleport-modal').click();
    cy.get('ion-modal').should('be.visible');

    // Verify modal content is interactable: close button should dismiss the modal
    cy.get('#close-teleport-modal').click();
    cy.get('ion-modal').should('not.exist');
  });

  it('should allow background interaction when showBackdrop=false', () => {
    cy.get('#open-teleport-modal').click();
    cy.get('ion-modal').should('be.visible');

    // Ensure the background button is clickable while modal is open
    cy.get('#teleport-background-action').click();
    cy.get('#teleport-background-action-count').should('have.text', '1');

    // Cleanup
    cy.get('#close-teleport-modal').click();
    cy.get('ion-modal').should('not.exist');
  });
});
