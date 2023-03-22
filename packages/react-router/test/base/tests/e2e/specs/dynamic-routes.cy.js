const port = 3000;
/*
This spec covers that routes can be added and navigated to at runtime.
Fixes bug reported in https://github.com/ionic-team/ionic/issues/21329
*/

describe('Dynamic Routes', () => {
  it('/dynamic-routes, when adding a dynamic route, we should be able to navigate to it', () => {
    cy.visit(`http://localhost:${port}/dynamic-routes`);
    cy.ionPageVisible('dynamic-routes-home');
    cy.get('button').contains('Add Route').click();
    cy.get('a').contains('Take me to the newRoute').click();
    cy.ionPageVisible('dynamic-routes-newroute');
  });

  it('/dynamic-routes, when trying to navigate to a route that has not been added, it should fail', () => {
    cy.visit(`http://localhost:${port}/dynamic-routes`);
    cy.ionPageVisible('dynamic-routes-home');
    cy.get('a').contains('Take me to the newRoute').click();
    cy.ionPageVisible('dynamic-routes-failed');
  });
});
