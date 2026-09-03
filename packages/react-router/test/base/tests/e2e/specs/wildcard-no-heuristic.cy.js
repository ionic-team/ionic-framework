const port = 3000;

/**
 * Tests that wildcard routing works with exact segment matching only,
 * without relying on string-similarity heuristics.
 *
 * Route configuration: "page", "ab", and "*"
 *
 * These tests would fail with any prefix/similarity heuristic because
 * the navigation targets intentionally share prefixes with specific routes:
 *   - "page2" shares prefix "page" with route "page"
 *   - "abc" shares prefix "ab" with route "ab"
 *   - "pager" shares prefix "page" with route "page"
 */
describe('Wildcard No Heuristic', () => {
  it('should navigate to "page" specific route', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-page').click();
    cy.ionPageVisible('heuristic-page');
    cy.get('[data-testid="page-content"]').should('exist');
  });

  it('should navigate to "ab" specific route', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-ab').click();
    cy.ionPageVisible('heuristic-ab');
    cy.get('[data-testid="ab-content"]').should('exist');
  });

  it('should navigate to "page2" via wildcard (not confused with "page" route)', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-page2').click();
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should navigate to "abc" via wildcard (not confused with "ab" route)', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-abc').click();
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should navigate to "pager" via wildcard (not confused with "page" route)', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-pager').click();
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should navigate to "unknown" via wildcard', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    cy.get('#go-to-unknown').click();
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should load "page2" directly via wildcard on URL visit', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic/page2`);
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should load "abc" directly via wildcard on URL visit', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic/abc`);
    cy.ionPageVisible('heuristic-catchall');
    cy.get('[data-testid="heuristic-catchall-content"]').should('exist');
  });

  it('should load "page" directly as specific route on URL visit', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic/page`);
    cy.ionPageVisible('heuristic-page');
    cy.get('[data-testid="page-content"]').should('exist');
  });

  it('should navigate to wildcard, go back, then navigate to specific route', () => {
    cy.visit(`http://localhost:${port}/wildcard-no-heuristic`);
    cy.ionPageVisible('heuristic-home');

    // Navigate to a wildcard route
    cy.get('#go-to-page2').click();
    cy.ionPageVisible('heuristic-catchall');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('heuristic-home');

    // Navigate to specific route — should work after returning from wildcard
    cy.get('#go-to-page').click();
    cy.ionPageVisible('heuristic-page');
    cy.get('[data-testid="page-content"]').should('exist');
  });
});
