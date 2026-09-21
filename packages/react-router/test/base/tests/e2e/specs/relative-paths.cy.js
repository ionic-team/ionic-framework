const port = 3000;

/**
 * Tests for relative path handling in IonRouterOutlet.
 * Verifies that routes with relative paths (no leading slash) work
 * the same as absolute paths, matching React Router 6 behavior.
 */
describe('Relative Paths Tests', () => {
  it('should navigate to the relative paths home page', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
  });

  it('should navigate to Page A (defined with absolute path)', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Page A');
    cy.ionPageVisible('relative-paths-page-a');
    cy.get('[data-testid="page-a-content"]').should('contain', 'Page A');
  });

  it('should navigate to Page B (defined with relative path - no leading slash)', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Page B');
    cy.ionPageVisible('relative-paths-page-b');
    cy.get('[data-testid="page-b-content"]').should('contain', 'Page B');
  });

  it('should navigate directly to Page B via URL', () => {
    cy.visit(`http://localhost:${port}/relative-paths/page-b`);
    cy.ionPageVisible('relative-paths-page-b');
    cy.get('[data-testid="page-b-content"]').should('contain', 'Page B');
  });

  it('should navigate to Page B and back', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Page B');
    cy.ionPageVisible('relative-paths-page-b');
    cy.ionBackClick('relative-paths-page-b');
    cy.ionPageVisible('relative-paths-home');
  });

  it('should render catch-all * route for unknown paths via navigation', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Unknown Page');
    cy.ionPageVisible('relative-paths-catch-all');
    cy.ionPageHidden('relative-paths-home');
    cy.get('[data-testid="catch-all-content"]').should('contain', 'not found');
  });

  it('should render catch-all * route for unknown paths via direct URL', () => {
    cy.visit(`http://localhost:${port}/relative-paths/some-nonexistent-page`);
    cy.ionPageVisible('relative-paths-catch-all');
    cy.get('[data-testid="catch-all-content"]').should('contain', 'not found');
  });

  it('should navigate to catch-all and back to home', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Unknown Page');
    cy.ionPageVisible('relative-paths-catch-all');
    cy.ionBackClick('relative-paths-catch-all');
    cy.ionPageVisible('relative-paths-home');
  });
});
