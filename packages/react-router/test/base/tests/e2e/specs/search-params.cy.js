describe('Search Params Navigation', () => {
  beforeEach(() => {
    cy.visit('/search-params');
    // Wait for the page to be visible
    cy.get('[data-pageid="search-params"]').should('be.visible');
  });

  it('should navigate when adding search params to the same path', () => {
    // Verify we start without search params
    cy.get('#current-path').should('have.text', '/search-params');
    cy.get('#query-value').should('have.text', '');

    // Click to add search param - this navigates from /search-params to /search-params?q=test
    cy.get('#add-search').click();

    // The URL should update with the search param
    cy.location('pathname').should('eq', '/search-params');
    cy.location('search').should('eq', '?q=test');

    // The component should re-render with the new search param value
    cy.get('#current-path').should('have.text', '/search-params?q=test');
    cy.get('#query-value').should('have.text', 'test');
  });

  it('should navigate when changing search params on the same path', () => {
    // First add a search param
    cy.get('#add-search').click();
    cy.get('#query-value').should('have.text', 'test');

    // Now change the search param
    cy.get('#change-search').click();

    cy.location('search').should('eq', '?q=changed');
    cy.get('#current-path').should('have.text', '/search-params?q=changed');
    cy.get('#query-value').should('have.text', 'changed');
  });

  it('should navigate when removing search params from the same path', () => {
    // First add a search param
    cy.get('#add-search').click();
    cy.get('#query-value').should('have.text', 'test');

    // Now remove the search param
    cy.get('#remove-search').click();

    cy.location('search').should('eq', '');
    cy.get('#current-path').should('have.text', '/search-params');
    cy.get('#query-value').should('have.text', '');
  });

  it('should restore search params when navigating back from another page', () => {
    // Add search param
    cy.get('#add-search').click();
    cy.get('#query-value').should('have.text', 'test');
    cy.location('search').should('eq', '?q=test');

    // Navigate to home page
    cy.get('#go-home').click();
    cy.get('[data-pageid="home"]').should('be.visible');
    cy.location('pathname').should('eq', '/');

    // Go back - should restore /search-params?q=test
    cy.go('back');
    cy.get('[data-pageid="search-params"]').should('be.visible');
    cy.location('pathname').should('eq', '/search-params');
    cy.location('search').should('eq', '?q=test');
    cy.get('#query-value').should('have.text', 'test');
  });

  it('should support back through multiple search param changes', () => {
    // Navigate: /search-params -> /search-params?q=test -> /search-params?q=changed
    cy.get('#add-search').click();
    cy.get('#query-value').should('have.text', 'test');

    cy.get('#change-search').click();
    cy.get('#query-value').should('have.text', 'changed');

    // Go back to ?q=test
    cy.go('back');
    cy.location('search').should('eq', '?q=test');
    cy.get('#query-value').should('have.text', 'test');

    // Go back to no search params
    cy.go('back');
    cy.location('search').should('eq', '');
    cy.get('#query-value').should('have.text', '');
  });
});
