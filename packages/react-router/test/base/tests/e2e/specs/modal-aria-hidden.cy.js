const port = 3000;

/**
 * Tests that aria-hidden is properly cleaned up on the root
 * ion-router-outlet when a modal is auto-removed during navigation
 * (i.e., removed without being explicitly dismissed).
 *
 * When a modal is presented, core sets aria-hidden="true" on the
 * root ion-router-outlet to hide background content from screen readers.
 * If the modal is dismissed via dismiss(), core cleans up aria-hidden.
 * But if the modal is removed from the DOM by a framework (e.g., React
 * unmounting during a route change), dismiss() is never called, so
 * aria-hidden must be cleaned up via the modal's disconnectedCallback.
 */
describe('Modal Aria Hidden Cleanup', () => {
  it('should not leave aria-hidden on root outlet when modal is removed via navigation', () => {
    cy.visit(`http://localhost:${port}/modal-aria-hidden`);
    cy.ionPageVisible('modal-page-a');

    // Open the modal and wait for it to be visible
    cy.get('#openModal').click();
    cy.get('ion-modal').should('be.visible');

    // The root outlet should have aria-hidden while modal is open
    cy.get('ion-router-outlet').first().should('have.attr', 'aria-hidden', 'true');

    // Navigate to section B without dismissing the modal
    cy.get('#navigateToB').should('be.visible').click();

    // Wait for navigation to complete
    cy.ionPageVisible('modal-page-b');

    // The modal should be removed from the DOM
    cy.get('ion-modal').should('not.exist');

    // The root outlet should NOT have aria-hidden anymore
    cy.get('ion-router-outlet').first().should('not.have.attr', 'aria-hidden');
  });
});
