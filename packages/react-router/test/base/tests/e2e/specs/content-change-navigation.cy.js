/**
 * Verifies that when view content changes (causing IonPage to remount)
 * while navigation is happening, the correct view is displayed.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/28878
 */

const port = 3000;

describe('Content Change Navigation Tests', () => {
  it('should navigate to list page correctly', () => {
    cy.visit(`http://localhost:${port}/content-change-navigation`);
    cy.ionPageVisible('content-nav-home');

    cy.get('[data-testid="go-to-list"]').click();
    cy.wait(300);

    cy.ionPageVisible('list-page');
    cy.url().should('include', '/content-change-navigation/list');
  });

  it('when clearing items and navigating, should show home page, not empty view', () => {
    cy.visit(`http://localhost:${port}/content-change-navigation`);
    cy.ionPageVisible('content-nav-home');

    cy.get('[data-testid="go-to-list"]').click();
    cy.wait(300);
    cy.ionPageVisible('list-page');

    // Bug scenario: clearing items renders a different IonPage while navigating away
    cy.get('[data-testid="clear-and-navigate"]').click();
    cy.wait(500);

    cy.url().should('include', '/content-change-navigation/home');
    cy.url().should('not.include', '/content-change-navigation/list');
    cy.ionPageVisible('content-nav-home');
    cy.get('[data-testid="home-content"]').should('be.visible');

    // The empty view should NOT be visible (the fix ensures it's hidden)
    cy.get('[data-testid="empty-view"]').should('not.be.visible');
  });

  it('direct navigation to home should work correctly', () => {
    cy.visit(`http://localhost:${port}/content-change-navigation/home`);
    cy.ionPageVisible('content-nav-home');
    cy.get('[data-testid="home-content"]').should('be.visible');
  });

  it('direct navigation to list should work correctly', () => {
    cy.visit(`http://localhost:${port}/content-change-navigation/list`);
    cy.ionPageVisible('list-page');
    cy.contains('Item 1').should('be.visible');
  });
});
