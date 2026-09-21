const port = 3000;

describe('Cross-Route Navigation', () => {
  /**
   * This test verifies that navigation between different top-level routes works correctly.
   *
   * Routing uses <IonRouterOutlet id="routing-main"> and MultipleTabs uses
   * <IonRouterOutlet id="multiple-tabs-main">, ensuring view isolation between outlets.
   */
  it('should navigate from home to routing and back correctly', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to routing by clicking the link
    cy.contains('ion-item', 'Routing').click();

    // Routing should redirect to /routing/tabs/home and show the home-page
    cy.ionPageVisible('home-page');

    // Go back to the main home page using browser back
    cy.go('back');

    // Home page should be visible again
    cy.ionPageVisible('home');
  });

  it('should navigate from home to multiple-tabs correctly', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs
    cy.contains('ion-item', 'Multiple Tabs').click();

    // Multiple tabs should redirect to /multiple-tabs/tab1/pagea and show PageA
    cy.ionPageVisible('PageA');
  });

  it('should navigate home -> routing -> back -> routing again', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to routing
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate to routing again - Navigate should fire again
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');
  });

  it('should navigate home -> multiple-tabs -> back -> multiple-tabs again', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs
    cy.contains('ion-item', 'Multiple Tabs').click();
    cy.ionPageVisible('PageA');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs again - Navigate should fire again
    cy.contains('ion-item', 'Multiple Tabs').click();
    cy.ionPageVisible('PageA');
  });

  /**
   * This test verifies behavior when navigating between different top-level routes
   * that use separate outlet IDs. With unique outlet IDs, view items are completely
   * isolated between outlets, so "stale views" from one outlet don't interfere with
   * another outlet.
   *
   * This test uses ionPageDoesNotExist instead of ionPageHidden because views from
   * one route hierarchy (like /routing/*) are completely unmounted (not just hidden)
   * when navigating to a different route hierarchy (like /multiple-tabs/*).
   */
  it('should navigate home -> routing -> home -> multiple-tabs without stale views', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to routing
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');
    cy.url().should('include', '/routing/tabs/home');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs - this is where stale views could interfere
    cy.contains('ion-item', 'Multiple Tabs').click();
    cy.ionPageVisible('PageA');
    cy.url().should('include', '/multiple-tabs/tab1/pagea');

    // The routing home-page should NOT exist in the DOM (views are unmounted when leaving route)
    cy.ionPageDoesNotExist('home-page');
  });

  /**
   * Test the reverse: multiple-tabs -> home -> routing
   * With unique outlet IDs, views are isolated and properly unmounted.
   */
  it('should navigate home -> multiple-tabs -> home -> routing without stale views', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs
    cy.contains('ion-item', 'Multiple Tabs').click();
    cy.ionPageVisible('PageA');
    cy.url().should('include', '/multiple-tabs/tab1/pagea');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate to routing - stale views from multiple-tabs should be cleaned up
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');
    cy.url().should('include', '/routing/tabs/home');

    // PageA from multiple-tabs should NOT exist in the DOM (views are unmounted when leaving route)
    cy.ionPageDoesNotExist('PageA');
  });

  /**
   * Test navigating to another page and back to routing
   * With unique outlet IDs, views are isolated and properly unmounted.
   */
  it('should not have overlay issues when navigating between different routes', () => {
    // Start at home
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Navigate to routing
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');

    // Go back to home
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate to multiple-tabs
    cy.contains('ion-item', 'Multiple Tabs').click();
    cy.ionPageVisible('PageA');

    // Go back to home again
    cy.go('back');
    cy.ionPageVisible('home');

    // Navigate back to routing - no stale views should overlay
    cy.contains('ion-item', 'Routing').click();
    cy.ionPageVisible('home-page');

    // Verify PageA does not exist in the DOM (views are unmounted when leaving route)
    cy.ionPageDoesNotExist('PageA');
  });
});
