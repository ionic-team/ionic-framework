const port = 3000;

describe('Tab History Isolation', () => {
  it('should NOT navigate back to previous tab when using back button after tab bar switch', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.ionTabClick('Tab B');
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-b');

    cy.get(`div.ion-page[data-pageid=tab-b]`)
      .find('ion-back-button')
      .click({ force: true });

    cy.wait(500);

    cy.ionPageVisible('tab-b');
    cy.ionPageHidden('tab-a');
    cy.url().should('include', '/tab-history-isolation/b');
  });

  it('should NOT allow back navigation through multiple tab switches', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.ionTabClick('Tab B');
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-b');

    cy.ionTabClick('Tab C');
    cy.ionPageHidden('tab-b');
    cy.ionPageVisible('tab-c');

    cy.get(`div.ion-page[data-pageid=tab-c]`)
      .find('ion-back-button')
      .click({ force: true });

    cy.wait(500);

    cy.ionPageVisible('tab-c');
    cy.url().should('include', '/tab-history-isolation/c');
  });

  it('should navigate back within the same tab when using back button', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.get('#go-to-a-details').click();
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-a-details');

    cy.ionBackClick('tab-a-details');
    cy.ionPageHidden('tab-a-details');
    cy.ionPageVisible('tab-a');

    cy.url().should('include', '/tab-history-isolation/a');
    cy.url().should('not.include', '/details');
  });

  it('should only navigate back within current tab after switching tabs and navigating', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.ionTabClick('Tab B');
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-b');

    cy.get('#go-to-b-details').click();
    cy.ionPageHidden('tab-b');
    cy.ionPageVisible('tab-b-details');

    cy.ionBackClick('tab-b-details');
    cy.ionPageHidden('tab-b-details');
    cy.ionPageVisible('tab-b');

    cy.url().should('include', '/tab-history-isolation/b');
    cy.url().should('not.include', '/details');

    cy.get(`div.ion-page[data-pageid=tab-b]`)
      .find('ion-back-button')
      .click({ force: true });

    cy.wait(500);

    cy.ionPageVisible('tab-b');
    cy.url().should('include', '/tab-history-isolation/b');
  });

  it('should preserve tab history when switching away and back', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.get('#go-to-a-details').click();
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-a-details');

    cy.ionTabClick('Tab B');
    cy.ionPageHidden('tab-a-details');
    cy.ionPageVisible('tab-b');

    cy.ionTabClick('Tab A');
    cy.ionPageHidden('tab-b');
    cy.ionPageVisible('tab-a-details');

    cy.ionBackClick('tab-a-details');
    cy.ionPageHidden('tab-a-details');
    cy.ionPageVisible('tab-a');
  });

  it('should have no back navigation when first visiting a tab', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    cy.get(`div.ion-page[data-pageid=tab-a]`)
      .find('ion-back-button')
      .click({ force: true });

    cy.wait(500);

    cy.ionPageVisible('tab-a');
    cy.url().should('include', '/tab-history-isolation/a');
  });

  /**
   * Browser back/forward tests for non-"/tabs/" URL paths.
   *
   * These tests verify that per-tab history isolation works correctly
   * when using browser back/forward buttons (POP events) with tab routes
   * that do NOT contain "/tabs/" in their URL path.
   *
   * The tab-history-isolation routes use paths like /tab-history-isolation/a,
   * /tab-history-isolation/b, etc. — no "/tabs/" segment. This exercises
   * the context-driven tab detection (via location history) rather than
   * URL-pattern-based detection.
   */
  it('should preserve tab context through browser back from detail page within a tab', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    // Navigate to details within Tab A
    cy.get('#go-to-a-details').click();
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-a-details');

    // Use browser back - should go back within the same tab
    cy.go('back');
    cy.ionPageVisible('tab-a');
    cy.url().should('include', '/tab-history-isolation/a');
    cy.url().should('not.include', '/details');
  });

  it('should handle browser forward after browser back within a tab', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    // Navigate to details within Tab A
    cy.get('#go-to-a-details').click();
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-a-details');

    // Browser back
    cy.go('back');
    cy.ionPageVisible('tab-a');
    cy.url().should('not.include', '/details');

    // Browser forward - should return to details
    cy.go('forward');
    cy.ionPageVisible('tab-a-details');
    cy.url().should('include', '/tab-history-isolation/a/details');
  });

  it('should preserve per-tab history when using browser back after navigating within a tab and switching tabs', () => {
    cy.visit(`http://localhost:${port}/tab-history-isolation/a`);
    cy.ionPageVisible('tab-a');

    // Navigate to details within Tab A
    cy.get('#go-to-a-details').click();
    cy.ionPageHidden('tab-a');
    cy.ionPageVisible('tab-a-details');

    // Switch to Tab B via tab bar
    cy.ionTabClick('Tab B');
    cy.ionPageHidden('tab-a-details');
    cy.ionPageVisible('tab-b');

    // Navigate to details within Tab B
    cy.get('#go-to-b-details').click();
    cy.ionPageHidden('tab-b');
    cy.ionPageVisible('tab-b-details');

    // Use browser back from Tab B details - should go back to Tab B root
    cy.go('back');
    cy.ionPageVisible('tab-b');
    cy.url().should('include', '/tab-history-isolation/b');
    cy.url().should('not.include', '/details');

    // Switch back to Tab A - should still show Tab A details (preserved)
    cy.ionTabClick('Tab A');
    cy.ionPageHidden('tab-b');
    cy.ionPageVisible('tab-a-details');
    cy.url().should('include', '/tab-history-isolation/a/details');
  });
});
