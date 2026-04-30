const port = 3000;

/**
 * Tests for relative links within nested IonRouterOutlet components.
 *
 * This specifically tests the scenario where:
 * 1. IonRouterOutlet has a catch-all route (*) containing IonTabs
 * 2. Inside tabs, there's another outlet with nested routes using index routes
 * 3. React Router's <Link to="relative"> is used for navigation
 *
 * The expected behavior is:
 * - <Link to="page-a"> at /nested-tabs-relative-links/tab1 should produce
 *   href="/nested-tabs-relative-links/tab1/page-a" (not /tab1/tab1/page-a)
 * - <Link to="/nested-tabs-relative-links/tab1/page-a"> should work and not 404
 */
describe('Nested Tabs with Relative Links', () => {
  it('should navigate to tab1 by default', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links`);
    cy.ionPageVisible('nested-tabs-relative-tab1');
    cy.get('[data-testid="tab1-content"]').should('exist');
  });

  it('should have correct href for relative link', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Check that the relative link has the correct href
    // It should be /nested-tabs-relative-links/tab1/page-a, NOT /tab1/tab1/page-a
    cy.get('[data-testid="link-relative-page-a"]')
      .should('have.attr', 'href', '/nested-tabs-relative-links/tab1/page-a');
  });

  it('should navigate to Page A via relative link', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Click the relative link
    cy.get('[data-testid="link-relative-page-a"]').click();

    // Should be at Page A
    cy.ionPageVisible('nested-tabs-relative-page-a');
    cy.get('[data-testid="page-a-content"]').should('exist');

    // URL should be correct
    cy.url().should('include', '/nested-tabs-relative-links/tab1/page-a');
    // URL should NOT have duplicate path segments
    cy.url().should('not.include', '/tab1/tab1/');
  });

  it('should navigate to Page A via absolute link', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Click the absolute link
    cy.get('[data-testid="link-absolute-page-a"]').click();

    // Should be at Page A (not 404)
    cy.ionPageVisible('nested-tabs-relative-page-a');
    cy.get('[data-testid="page-a-content"]').should('exist');

    // Should NOT show 404
    cy.get('[data-testid="not-found"]').should('not.exist');
  });

  it('should navigate to Page B via relative link', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Click the relative link to page B
    cy.get('[data-testid="link-relative-page-b"]').click();

    // Should be at Page B
    cy.ionPageVisible('nested-tabs-relative-page-b');
    cy.get('[data-testid="page-b-content"]').should('exist');

    // URL should be correct
    cy.url().should('include', '/nested-tabs-relative-links/tab1/page-b');
  });

  it('should navigate to Page A and back', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Navigate to Page A
    cy.get('[data-testid="link-relative-page-a"]').click();
    cy.ionPageVisible('nested-tabs-relative-page-a');

    // Go back
    cy.ionBackClick('nested-tabs-relative-page-a');

    // Should be back at Tab 1
    cy.ionPageVisible('nested-tabs-relative-tab1');
  });

  it('should directly visit Page A via URL', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1/page-a`);

    // Should be at Page A (not 404)
    cy.ionPageVisible('nested-tabs-relative-page-a');
    cy.get('[data-testid="page-a-content"]').should('exist');
  });

  /**
   * This test navigates from the home page (/) to nested-tabs-relative-links
   * via routerLink, rather than visiting the URL directly.
   *
   * This is a distinct scenario because NestedTabsRelativeLinks is a container
   * route that does NOT wrap its content in IonPage — it renders IonRouterOutlet
   * directly. When the root outlet transitions to a container without IonPage,
   * the nested <Navigate to="tab1" replace /> redirect fires before the root
   * outlet's timeout, causing the leaving view reference to shift. Without
   * proper handling, the home page is never hidden.
   */
  it('should navigate from home page to nested tabs', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // Click the Nested Tabs Relative Links item
    cy.get('ion-item[router-link="/nested-tabs-relative-links"]').click();

    // Should navigate to tab1 (via index redirect)
    cy.ionPageVisible('nested-tabs-relative-tab1');
    cy.get('[data-testid="tab1-content"]').should('exist');

    // Home page should be hidden
    cy.ionPageHidden('home');

    // URL should be correct
    cy.url().should('include', '/nested-tabs-relative-links/tab1');

    // Verify the container route does NOT have an IonPage wrapper.
    // This is the key invariant: NestedTabsRelativeLinks renders IonRouterOutlet
    // directly without IonPage. If someone adds IonPage to the container, this
    // test would pass trivially and no longer cover the container-without-IonPage
    // transition path. The ion-tabs element should have no [data-pageid] ancestors,
    // confirming no IonPage wraps the container.
    cy.get('ion-tabs').parents('[data-pageid]').should('have.length', 0);
  });

  it('should switch tabs and maintain correct relative link resolution', () => {
    cy.visit(`http://localhost:${port}/nested-tabs-relative-links/tab1`);
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // Switch to Tab 2
    cy.ionTabClick('Tab 2');
    cy.ionPageVisible('nested-tabs-relative-tab2');

    // Switch back to Tab 1
    cy.ionTabClick('Tab 1');
    cy.ionPageVisible('nested-tabs-relative-tab1');

    // The relative link should still have correct href
    cy.get('[data-testid="link-relative-page-a"]')
      .should('have.attr', 'href', '/nested-tabs-relative-links/tab1/page-a');
  });
});
