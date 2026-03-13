const port = 3000;

/**
 * Tests for index route reuse across tabs with nested outlets.
 *
 * Validates that switching between tabs where each has its own nested
 * IonRouterOutlet with an index route correctly shows the right content.
 * This tests whether createViewItem's index route reuse check
 * (existingIsIndexRoute && newIsIndexRoute) causes issues when multiple
 * outlets each have their own index routes.
 */
describe('Index Route Reuse - Nested Outlet Index Routes', () => {
  it('should show tab1 index content by default', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse`);
    cy.ionPageVisible('irr-tab1-home');
    cy.get('[data-testid="irr-tab1-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab1-home-content"]').should('contain', 'Tab 1 Index Route Content');
  });

  it('should show tab2 index content when switching to tab2', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse/tab1`);
    cy.ionPageVisible('irr-tab1-home');

    // Switch to Tab 2
    cy.ionTabClick('Tab 2');
    cy.url().should('include', '/index-route-reuse/tab2');
    cy.ionPageVisible('irr-tab2-home');
    cy.get('[data-testid="irr-tab2-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab2-home-content"]').should('contain', 'Tab 2 Index Route Content');
  });

  it('should show tab3 index content when switching to tab3', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse/tab1`);
    cy.ionPageVisible('irr-tab1-home');

    // Switch to Tab 3
    cy.ionTabClick('Tab 3');
    cy.url().should('include', '/index-route-reuse/tab3');
    cy.ionPageVisible('irr-tab3-home');
    cy.get('[data-testid="irr-tab3-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab3-home-content"]').should('contain', 'Tab 3 Index Route Content');
  });

  it('should correctly show each tab index when cycling through all tabs', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse/tab1`);
    cy.ionPageVisible('irr-tab1-home');
    cy.get('[data-testid="irr-tab1-home-content"]').should('be.visible');

    // Tab 1 -> Tab 2
    cy.ionTabClick('Tab 2');
    cy.url().should('include', '/index-route-reuse/tab2');
    cy.ionPageVisible('irr-tab2-home');
    cy.get('[data-testid="irr-tab2-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab2-home-content"]').should('contain', 'Tab 2 Index Route Content');

    // Tab 2 -> Tab 3
    cy.ionTabClick('Tab 3');
    cy.url().should('include', '/index-route-reuse/tab3');
    cy.ionPageVisible('irr-tab3-home');
    cy.get('[data-testid="irr-tab3-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab3-home-content"]').should('contain', 'Tab 3 Index Route Content');

    // Tab 3 -> Tab 1 (back to start)
    cy.ionTabClick('Tab 1');
    cy.url().should('include', '/index-route-reuse/tab1');
    cy.ionPageVisible('irr-tab1-home');
    cy.get('[data-testid="irr-tab1-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab1-home-content"]').should('contain', 'Tab 1 Index Route Content');
  });

  it('should preserve tab1 detail navigation and return correctly', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse/tab1`);
    cy.ionPageVisible('irr-tab1-home');

    // Navigate to detail page
    cy.get('#irr-tab1-detail-btn').click();
    cy.ionPageVisible('irr-tab1-detail');
    cy.get('[data-testid="irr-tab1-detail-content"]').should('be.visible');

    // Switch to Tab 2
    cy.ionTabClick('Tab 2');
    cy.url().should('include', '/index-route-reuse/tab2');
    cy.ionPageVisible('irr-tab2-home');
    cy.get('[data-testid="irr-tab2-home-content"]').should('be.visible');

    // Switch back to Tab 1 - should show detail (preserved history)
    cy.ionTabClick('Tab 1');
    cy.url().should('include', '/index-route-reuse/tab1');
    cy.ionPageVisible('irr-tab1-detail');
    cy.get('[data-testid="irr-tab1-detail-content"]').should('be.visible');
  });

  it('should show correct content after rapid tab switching', () => {
    cy.visit(`http://localhost:${port}/index-route-reuse/tab1`);
    cy.ionPageVisible('irr-tab1-home');

    // Rapid switching: Tab1 -> Tab2 -> Tab3 -> Tab2 -> Tab1
    cy.ionTabClick('Tab 2');
    cy.url().should('include', '/index-route-reuse/tab2');
    cy.ionPageVisible('irr-tab2-home');

    cy.ionTabClick('Tab 3');
    cy.url().should('include', '/index-route-reuse/tab3');
    cy.ionPageVisible('irr-tab3-home');

    cy.ionTabClick('Tab 2');
    cy.url().should('include', '/index-route-reuse/tab2');
    cy.ionPageVisible('irr-tab2-home');
    cy.get('[data-testid="irr-tab2-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab2-home-content"]').should('contain', 'Tab 2 Index Route Content');

    cy.ionTabClick('Tab 1');
    cy.url().should('include', '/index-route-reuse/tab1');
    cy.ionPageVisible('irr-tab1-home');
    cy.get('[data-testid="irr-tab1-home-content"]').should('be.visible');
    cy.get('[data-testid="irr-tab1-home-content"]').should('contain', 'Tab 1 Index Route Content');
  });
});
