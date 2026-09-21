const port = 3000;

/**
 * Verifies that the matchRoutes()-based findRouteByRouteInfo works correctly
 * for various route patterns: absolute, relative, nested, tabs, index.
 */
describe('matchRoutes integration', () => {
  it('should match absolute routes at root outlet', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');
  });

  it('should match relative routes in nested outlet', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');
  });

  it('should match routes after tab switch', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');

    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
  });

  it('should match routes after switching tabs back', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');

    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');

    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
  });
});
