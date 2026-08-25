const port = 3000;

describe('Index Param Priority', () => {
  /*
    Tests route specificity and priority in an outlet with:
      <Route index />          (index route)
      <Route path=":slug" />   (single-param route)
      <Route path="*" />       (catch-all wildcard)

    Validates:
    1. Index routes are prioritized over parameterized routes in both
       route creation and view lookup (sort consistency fix).
    2. Multi-segment paths match the wildcard, not the single-param route
       (computeParentPath fix to respect outlet mount path).
  */

  it('should show the index page on initial visit', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should navigate to slug and back to index via routerLink', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    cy.get('#back-to-index').click();
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should navigate to slug and back to index via browser back', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should handle round-trip: index -> slug -> index -> slug -> index', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug-world').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: world');

    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should handle browser back through multiple navigations', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    cy.get('#back-to-index').click();
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-slug-world').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: world');

    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should handle direct deep link to slug then navigate to index', () => {
    cy.visit(`http://localhost:${port}/index-param-priority/hello`);
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    cy.get('#back-to-index').click();
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  // Wildcard matching tests - multi-segment paths should match * not :slug
  it('should navigate to wildcard page for multi-segment path and back to index', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-wildcard').click();
    cy.get('[data-testid="notfound-page-label"]').should('contain', 'Page not found');

    cy.get('#back-to-index-from-notfound').click();
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should navigate slug -> index -> wildcard -> index round-trip', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    // Go to slug
    cy.get('#go-to-slug').click();
    cy.get('[data-testid="slug-page-label"]').should('contain', 'Slug page: hello');

    // Back to index
    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');

    // Go to wildcard path
    cy.get('#go-to-wildcard').click();
    cy.get('[data-testid="notfound-page-label"]').should('contain', 'Page not found');

    // Back to index
    cy.get('#back-to-index-from-notfound').click();
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should handle browser back from wildcard to index', () => {
    cy.visit(`http://localhost:${port}/index-param-priority`);
    cy.ionPageVisible('index-param-priority-index');

    cy.get('#go-to-wildcard').click();
    cy.get('[data-testid="notfound-page-label"]').should('contain', 'Page not found');

    cy.go('back');
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });

  it('should show wildcard page on direct deep-link to multi-segment path', () => {
    cy.visit(`http://localhost:${port}/index-param-priority/deep/nested/path`);
    cy.get('[data-testid="notfound-page-label"]').should('contain', 'Page not found');

    cy.get('#back-to-index-from-notfound').click();
    cy.url().should('include', '/index-param-priority');
    cy.wait(300);
    cy.ionPageVisible('index-param-priority-index');
    cy.get('[data-testid="index-page-label"]').should('contain', 'This is the index page');
  });
});
