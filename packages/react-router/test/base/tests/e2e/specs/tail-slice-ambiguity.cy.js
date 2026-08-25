const port = 3000;

/**
 * Tests that derivePathnameToMatch's tail-slice heuristic does not produce
 * false positive matches that incorrectly deactivate catch-all routes.
 *
 * Route structure:
 *   /tail-slice-ambiguity/*
 *     ├── index → ListPage
 *     ├── details/:id → DetailsPage
 *     └── * → CatchAllPage
 *
 * Bug: navigating to /tail-slice-ambiguity/extra/details/99 after visiting
 * /tail-slice-ambiguity/details/42 causes the tail-slice to extract
 * ["details", "99"] which falsely matches details/:id, deactivating the
 * catch-all page.
 */
describe('Tail-Slice Ambiguity', () => {
  it('should show details page for /details/:id', () => {
    cy.visit(`http://localhost:${port}/tail-slice-ambiguity`);
    cy.ionPageVisible('tail-slice-list');

    cy.get('#go-to-details').click();
    cy.ionPageVisible('tail-slice-details');
    cy.get('[data-testid="details-id"]').should('contain', 'Details ID: 42');
  });

  it('should show catch-all when path has extra segments before details', () => {
    cy.visit(`http://localhost:${port}/tail-slice-ambiguity`);
    cy.ionPageVisible('tail-slice-list');

    // First create the details/:id view
    cy.get('#go-to-details').click();
    cy.ionPageVisible('tail-slice-details');
    cy.get('[data-testid="details-id"]').should('contain', 'Details ID: 42');

    // Go back to list
    cy.get('#back-to-list').click();
    cy.ionPageVisible('tail-slice-list');

    // Navigate to ambiguous path - should show catch-all, NOT details
    cy.get('#go-to-ambiguous').click();
    cy.ionPageVisible('tail-slice-catchall');
    cy.get('[data-testid="catchall-path"]').should('contain', '/tail-slice-ambiguity/extra/details/99');
  });

  it('should show catch-all for ambiguous path on direct navigation', () => {
    cy.visit(`http://localhost:${port}/tail-slice-ambiguity/extra/details/99`);
    cy.ionPageVisible('tail-slice-catchall');
    cy.get('[data-testid="catchall-path"]').should('contain', '/tail-slice-ambiguity/extra/details/99');
  });

  it('should correctly navigate: details → list → ambiguous → back to list', () => {
    cy.visit(`http://localhost:${port}/tail-slice-ambiguity`);
    cy.ionPageVisible('tail-slice-list');

    // Visit details
    cy.get('#go-to-details').click();
    cy.ionPageVisible('tail-slice-details');
    cy.get('[data-testid="details-id"]').should('contain', 'Details ID: 42');

    // Back to list
    cy.get('#back-to-list').click();
    cy.ionPageVisible('tail-slice-list');

    // Visit ambiguous path (catch-all)
    cy.get('#go-to-ambiguous').click();
    cy.ionPageVisible('tail-slice-catchall');

    // Back to list via browser back
    cy.go('back');
    cy.ionPageVisible('tail-slice-list');
  });
});
