const port = 3000;

describe('Stale View Cleanup', () => {
  /**
   * Tests that non-IonPage components are properly cleaned up from the DOM
   * after navigating away. Both source and target lack IonPage wrappers.
   * Guards against regressions in the view stack cleanup logic.
   */
  it('should clean up stale non-IonPage view after navigating to another non-IonPage view', () => {
    cy.visit(`http://localhost:${port}/stale-view-cleanup/non-ionpage`);

    // Verify the non-IonPage source component is visible
    cy.get('[data-testid="non-ionpage-source"]').should('exist');

    // Navigate to the target (also non-IonPage)
    cy.get('#go-to-target').click();

    // Verify the target loaded
    cy.get('[data-testid="target-loaded"]').should('exist');

    // The non-IonPage source component should be cleaned up from the DOM
    cy.get('[data-testid="non-ionpage-source"]').should('not.exist');
  });
});
