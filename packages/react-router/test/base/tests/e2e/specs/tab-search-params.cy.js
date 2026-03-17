const port = 3000;

describe('Tab Button Search Params (Issue #25470)', () => {
  it('should preserve query params when navigating to a tab for the first time', () => {
    cy.visit(`http://localhost:${port}/tab-search-params`);

    // The index route redirects to tab1?foo=bar
    cy.ionPageVisible('tab-search-tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('#tab1-foo-value').should('have.text', 'bar');
  });

  it('should preserve query params when switching to another tab', () => {
    cy.visit(`http://localhost:${port}/tab-search-params/tab1?foo=bar`);
    cy.ionPageVisible('tab-search-tab1');

    // Click tab2 which has href="/tab-search-params/tab2?baz=qux"
    cy.ionTabClick('Tab2');
    cy.ionPageVisible('tab-search-tab2');

    cy.location('pathname').should('eq', '/tab-search-params/tab2');
    cy.location('search').should('eq', '?baz=qux');
    cy.get('#tab2-baz-value').should('have.text', 'qux');
  });

  it('should preserve query params when switching back to a previously visited tab', () => {
    cy.visit(`http://localhost:${port}/tab-search-params/tab1?foo=bar`);
    cy.ionPageVisible('tab-search-tab1');

    // Switch to tab2
    cy.ionTabClick('Tab2');
    cy.ionPageVisible('tab-search-tab2');

    // Switch back to tab1
    cy.ionTabClick('Tab1');
    cy.ionPageVisible('tab-search-tab1');

    cy.location('pathname').should('eq', '/tab-search-params/tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('#tab1-foo-value').should('have.text', 'bar');
  });

  it('should preserve query params when clicking the already active tab', () => {
    cy.visit(`http://localhost:${port}/tab-search-params/tab1?foo=bar`);
    cy.ionPageVisible('tab-search-tab1');

    // Click tab1 again (already active)
    cy.ionTabClick('Tab1');

    cy.location('pathname').should('eq', '/tab-search-params/tab1');
    cy.location('search').should('eq', '?foo=bar');
    cy.get('#tab1-foo-value').should('have.text', 'bar');
  });
});
