const port = 3000;

/**
 * Tests that wildcard routes work correctly when specific routes share
 * a common prefix with the navigation target.
 *
 * Bug: couldSpecificRouteMatch used a 3-char prefix heuristic that
 * falsely blocked wildcard matches (e.g., "settings" vs "setup" both
 * start with "set", causing the wildcard to not match "setup").
 */
describe('Prefix Match Wildcard', () => {
  it('should navigate to settings (specific route match)', () => {
    cy.visit(`http://localhost:${port}/prefix-match-wildcard`);
    cy.ionPageVisible('prefix-home');

    cy.get('#go-to-settings').click();
    cy.ionPageVisible('prefix-settings');
    cy.get('[data-testid="settings-content"]').should('exist');
  });

  it('should navigate to setup via wildcard (shares "set" prefix with settings)', () => {
    cy.visit(`http://localhost:${port}/prefix-match-wildcard`);
    cy.ionPageVisible('prefix-home');

    cy.get('#go-to-setup').click();
    cy.ionPageVisible('prefix-catchall');
    cy.get('[data-testid="catchall-content"]').should('exist');
  });

  it('should navigate to unknown path via wildcard', () => {
    cy.visit(`http://localhost:${port}/prefix-match-wildcard`);
    cy.ionPageVisible('prefix-home');

    cy.get('#go-to-unknown').click();
    cy.ionPageVisible('prefix-catchall');
    cy.get('[data-testid="catchall-content"]').should('exist');
  });

  it('should load settings directly when visiting URL', () => {
    cy.visit(`http://localhost:${port}/prefix-match-wildcard/settings`);
    cy.ionPageVisible('prefix-settings');
    cy.get('[data-testid="settings-content"]').should('exist');
  });

  it('should load setup directly via wildcard when visiting URL (no prior mount path)', () => {
    // Direct visit — no prior navigation, so outletMountPath is undefined.
    // Bug: the 3-char prefix heuristic in couldSpecificRouteMatch sees that
    // "settings" and "setup" both start with "set", blocks the wildcard,
    // and the index route incorrectly claims the match at the wrong depth.
    cy.visit(`http://localhost:${port}/prefix-match-wildcard/setup`);
    cy.ionPageVisible('prefix-catchall');
    cy.get('[data-testid="catchall-content"]').should('exist');
  });

  it('should navigate to wildcard, go back, then navigate to settings', () => {
    cy.visit(`http://localhost:${port}/prefix-match-wildcard`);
    cy.ionPageVisible('prefix-home');

    // Navigate to a wildcard route
    cy.get('#go-to-setup').click();
    cy.ionPageVisible('prefix-catchall');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('prefix-home');

    // Navigate to settings — this should work after returning from wildcard
    cy.get('#go-to-settings').click();
    cy.ionPageVisible('prefix-settings');
    cy.get('[data-testid="settings-content"]').should('exist');
  });
});
