const port = 3000;

/**
 * Tests for relative paths (e.g., "tab1/*") inside root-level splat routes (*).
 * Verifies the fix for routes not matching when parent is a splat-only route.
 */
describe('Root Splat Tabs - Customer Reproduction', () => {
  it('should navigate to tab1 by default when visiting /root-splat-tabs', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs`);
    // Should redirect to tab1 and show tab1 content
    cy.ionPageVisible('root-splat-tab1');
    cy.get('[data-testid="root-splat-tab1-content"]').should('exist');
  });

  it('should load tab1 when directly visiting /root-splat-tabs/tab1', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    // CRITICAL: This should show tab1 content, NOT 404
    cy.ionPageVisible('root-splat-tab1');
    cy.get('[data-testid="root-splat-tab1-content"]').should('exist');
    cy.get('[data-testid="root-splat-not-found"]').should('not.exist');
  });

  it('should load Page A when directly visiting /root-splat-tabs/tab1/page-a', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1/page-a`);
    // CRITICAL: This should show Page A, NOT 404
    // This is the exact issue the customer reported
    cy.ionPageVisible('root-splat-page-a');
    cy.get('[data-testid="root-splat-page-a-content"]').should('exist');
    cy.get('[data-testid="root-splat-not-found"]').should('not.exist');
  });

  it('should navigate to Page A via relative link', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    cy.ionPageVisible('root-splat-tab1');

    // Click the relative link
    cy.get('[data-testid="link-relative-page-a"]').click();

    // Should be at Page A (not 404)
    cy.ionPageVisible('root-splat-page-a');
    cy.get('[data-testid="root-splat-page-a-content"]').should('exist');
    cy.get('[data-testid="root-splat-not-found"]').should('not.exist');

    // URL should be correct
    cy.url().should('include', '/root-splat-tabs/tab1/page-a');
  });

  it('should navigate to Page A via absolute link', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    cy.ionPageVisible('root-splat-tab1');

    // Click the absolute link
    cy.get('[data-testid="link-absolute-page-a"]').click();

    // Should be at Page A (not 404)
    cy.ionPageVisible('root-splat-page-a');
    cy.get('[data-testid="root-splat-page-a-content"]').should('exist');
    cy.get('[data-testid="root-splat-not-found"]').should('not.exist');
  });

  it('should have correct href for relative link', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    cy.ionPageVisible('root-splat-tab1');

    // The relative link should resolve to the correct absolute href
    cy.get('[data-testid="link-relative-page-a"]')
      .should('have.attr', 'href', '/root-splat-tabs/tab1/page-a');
  });

  it('should navigate between tabs correctly', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    cy.ionPageVisible('root-splat-tab1');

    // Switch to Tab 2
    cy.ionTabClick('Tab 2');
    cy.ionPageVisible('root-splat-tab2');

    // Switch back to Tab 1
    cy.ionTabClick('Tab 1');
    cy.ionPageVisible('root-splat-tab1');
  });

  it('should navigate to Page A and back to Tab 1', () => {
    cy.visit(`http://localhost:${port}/root-splat-tabs/tab1`);
    cy.ionPageVisible('root-splat-tab1');

    // Navigate to Page A
    cy.get('[data-testid="link-relative-page-a"]').click();
    cy.ionPageVisible('root-splat-page-a');

    // Go back
    cy.ionBackClick('root-splat-page-a');
    cy.ionPageVisible('root-splat-tab1');
  });
});
