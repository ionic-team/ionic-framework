const port = 3000;

describe('IonRoute Props', () => {
  /**
   * Tests that IonRoute correctly forwards index and caseSensitive props.
   *
   * Previously, IonRouteInner only destructured path and element,
   * silently dropping index and caseSensitive props.
   */

  describe('index prop', () => {
    it('should render the index route when navigating to parent path', () => {
      cy.visit(`http://localhost:${port}/ion-route-props`);
      cy.ionPageVisible('index-home');
      cy.get('#index-home-text').should('be.visible').and('contain', 'This is the index route');
    });

    it('should navigate from index route to details and back', () => {
      cy.visit(`http://localhost:${port}/ion-route-props`);
      cy.ionPageVisible('index-home');
      cy.ionNav('ion-button', 'Go to Details');
      cy.ionPageVisible('ion-route-details');
      cy.get('#details-text').should('be.visible');
      cy.ionNav('ion-button', 'Back to Home');
      cy.ionPageVisible('index-home');
    });
  });

  describe('caseSensitive prop', () => {
    it('should match the exact case path', () => {
      cy.visit(`http://localhost:${port}/ion-route-props/CaseSensitive`);
      cy.ionPageVisible('case-sensitive-page');
      cy.get('#case-sensitive-text').should('be.visible');
    });

    it('should not match a different case path when caseSensitive is true', () => {
      cy.visit(`http://localhost:${port}/ion-route-props/casesensitive`);
      // The case-sensitive page should NOT be visible since the case doesn't match
      cy.get('[data-pageid="case-sensitive-page"]').should('not.exist');
    });
  });
});
