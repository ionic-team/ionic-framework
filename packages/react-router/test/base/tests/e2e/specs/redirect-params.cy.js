/**
 * Verifies that useParams() returns correct values after a Navigate
 * (catch-all redirect) fires inside IonRouterOutlet.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/23743
 */

const port = 3000;

describe('Redirect Params', () => {

  describe('Tabs with catch-all Navigate redirect', () => {
    // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23743
    it('should have correct params after redirect then tab navigation', () => {
      cy.visit(`http://localhost:${port}/redirect-params/tabs`);

      // Wait for the redirect to complete and tab2 to load
      cy.get('[data-testid="tab2-loaded"]').should('be.visible');
      cy.url().should('include', '/redirect-params/tabs/tab2');

      // Click "Tab 1" tab button which navigates to /redirect-params/tabs/tab1/TESTING
      cy.get('ion-tab-button[tab="tab1"]').click();

      // Verify the page loaded and params are correct
      cy.ionPageVisible('tab1-with-param');
      cy.get('[data-testid="param-value"]').should('have.text', 'TESTING');
      cy.get('#param-display').should('contain.text', 'Tab 1 with param: TESTING');
    });

    it('should have correct params after redirect then button navigation', () => {
      cy.visit(`http://localhost:${port}/redirect-params/tabs`);

      cy.get('[data-testid="tab2-loaded"]').should('be.visible');

      // Navigate to Tab 1 via the routerLink button
      cy.get('#go-to-tab1').click();

      cy.ionPageVisible('tab1-with-param');
      cy.get('[data-testid="param-value"]').should('have.text', 'TESTING');
    });
  });

  describe('Flat outlet with catch-all Navigate redirect', () => {
    it('should have correct params after redirect then navigation to parameterized route', () => {
      cy.visit(`http://localhost:${port}/redirect-params/flat`);

      cy.get('[data-testid="home-loaded"]').should('be.visible');
      cy.url().should('include', '/redirect-params/flat/home');

      cy.get('#go-to-details-42').click();

      cy.ionPageVisible('details-page');
      cy.get('[data-testid="detail-param-value"]').should('have.text', '42');
      cy.get('#detail-display').should('contain.text', 'Detail ID: 42');
    });

    it('should have correct params for multiple different parameterized navigations after redirect', () => {
      cy.visit(`http://localhost:${port}/redirect-params/flat`);

      cy.get('[data-testid="home-loaded"]').should('be.visible');

      cy.get('#go-to-details-42').click();
      cy.get('[data-testid="detail-param-value"]').should('have.text', '42');

      cy.go('back');
      cy.get('[data-testid="home-loaded"]').should('be.visible');

      cy.get('#go-to-details-99').click();
      cy.get('[data-testid="detail-param-value"]').should('have.text', '99');
    });
  });
});
