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

  it('should navigate to Page C (defined with relative path - no leading slash)', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Page C');
    cy.ionPageVisible('relative-paths-page-c');
    cy.get('[data-testid="page-c-content"]').should('contain', 'Page C');
  });

  it('should navigate directly to Page B via URL', () => {
    cy.visit(`http://localhost:${port}/relative-paths/page-b`);
    cy.ionPageVisible('relative-paths-page-b');
    cy.get('[data-testid="page-b-content"]').should('contain', 'Page B');
  });

  it('should navigate directly to Page C via URL', () => {
    cy.visit(`http://localhost:${port}/relative-paths/page-c`);
    cy.ionPageVisible('relative-paths-page-c');
    cy.get('[data-testid="page-c-content"]').should('contain', 'Page C');
  });

  it('should navigate to Page B and back', () => {
    cy.visit(`http://localhost:${port}/relative-paths`);
    cy.ionPageVisible('relative-paths-home');
    cy.ionNav('ion-item', 'Go to Page B');
    cy.ionPageVisible('relative-paths-page-b');
    cy.ionBackClick('relative-paths-page-b');
    cy.ionPageVisible('relative-paths-home');
  });
});
