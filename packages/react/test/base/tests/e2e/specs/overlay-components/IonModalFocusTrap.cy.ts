describe('IonModal: focusTrap regression', () => {
  beforeEach(() => {
    cy.visit('/overlay-components/modal-focus-trap');
  });

  it('should allow interacting with background when focusTrap=false', () => {
    cy.get('#open-non-trapped-modal').click();
    // Use 'exist' instead of 'be.visible' because the modal has pointer-events: none
    // to allow background interaction, which Cypress interprets as "covered"
    cy.get('ion-modal.show-modal').should('exist');

    cy.get('#background-action').click();
    cy.get('#background-action-count').should('have.text', '1');
  });

  it('should prevent interacting with background when focusTrap=true', () => {
    cy.get('#open-trapped-modal').click();
    cy.get('ion-modal.show-modal').should('be.visible');

    // Ensure backdrop is active and capturing pointer events
    cy.get('ion-backdrop').should('exist');
    cy.get('ion-backdrop').should('have.css', 'pointer-events', 'auto');

    // Baseline: counter is 0
    cy.get('#background-action-count').should('have.text', '0');

    // Click the center of the background button via body coordinates (topmost element will receive it)
    cy.get('#background-action').then(($btn) => {
      const rect = $btn[0].getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      cy.get('body').click(x, y);
    });

    // Counter should remain unchanged
    cy.get('#background-action-count').should('have.text', '0');
  });
});
