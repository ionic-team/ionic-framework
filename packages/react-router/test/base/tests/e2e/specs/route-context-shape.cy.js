const port = 3000;

/**
 * Validates that React Router's UNSAFE_RouteContext shape is compatible with
 * @ionic/react-router. This is a canary test — if React Router changes the
 * internal context shape, these tests will fail and signal that the
 * RouteContextMatch type and buildContextMatches need updating.
 *
 * The validators read Ionic's constructed context (built by buildContextMatches
 * in ReactRouterViewStack), which mirrors the native RR6 shape. If the shape
 * Ionic produces drifts, components like useParams() will break.
 */
describe('UNSAFE_RouteContext shape validation', () => {
  it('should produce valid constructed context shape at root outlet level', () => {
    cy.visit(`http://localhost:${port}/route-context-shape`);
    cy.ionPageVisible('route-context-root');

    // The root validator reads Ionic's constructed context and verifies
    // that buildContextMatches produces entries with the expected shape
    cy.get('#validator-root')
      .should('have.attr', 'data-has-context', 'true')
      .should('have.attr', 'data-all-valid', 'true');

    // Should have at least 1 match (the route-context-shape/* route)
    cy.get('#validator-root')
      .invoke('attr', 'data-match-count')
      .then((count) => {
        expect(parseInt(count, 10)).to.be.greaterThan(0);
      });
  });

  it('should produce valid constructed context shape at nested level with params', () => {
    cy.visit(`http://localhost:${port}/route-context-shape`);
    cy.ionPageVisible('route-context-root');

    // Navigate to nested route with params
    cy.get('#go-nested').click();
    cy.ionPageVisible('route-context-nested');

    // The nested validator reads Ionic's constructed context at a deeper
    // level — verifies parent + child matches are both correctly shaped
    cy.get('#validator-nested')
      .should('have.attr', 'data-has-context', 'true')
      .should('have.attr', 'data-all-valid', 'true');

    // Nested route should have more matches than root (parent + child)
    cy.get('#validator-nested')
      .invoke('attr', 'data-match-count')
      .then((count) => {
        expect(parseInt(count, 10)).to.be.greaterThan(1);
      });

    // Params should be correctly propagated through context
    cy.get('#nested-params').should('contain', '"id":"42"');
  });
});
