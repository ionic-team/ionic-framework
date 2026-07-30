const port = 3000;

/**
 * Tests that IonBackButton works correctly after navigating with
 * routerDirection="none". The back button should use history to
 * determine the previous page, not fall back to defaultHref.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/24074
 */
describe('routerDirection="none" Back Button', () => {

  it('back button should return to Page A after navigating with direction "forward"', () => {
    cy.visit(`http://localhost:${port}/direction-none-back/a`);
    cy.ionPageVisible('direction-none-page-a');

    // Navigate A -> B with default forward direction
    cy.ionNav('ion-button#go-forward', 'Go to B (forward)');
    cy.ionPageVisible('direction-none-page-b');

    // Back button should go back to Page A (not to defaultHref fallback)
    cy.ionBackClick('direction-none-page-b');
    cy.ionPageDoesNotExist('direction-none-fallback');
    cy.ionPageVisible('direction-none-page-a');
    cy.url().should('include', '/direction-none-back/a');
  });

  it('back button should return to Page A after navigating with direction "none"', () => {
    cy.visit(`http://localhost:${port}/direction-none-back/a`);
    cy.ionPageVisible('direction-none-page-a');

    // Navigate A -> B with routerDirection="none"
    cy.ionNav('ion-button#go-none', 'Go to B (none)');
    cy.ionPageVisible('direction-none-page-b');

    // Back button should go back to Page A (not to defaultHref fallback)
    cy.ionBackClick('direction-none-page-b');
    cy.ionPageDoesNotExist('direction-none-fallback');
    cy.ionPageVisible('direction-none-page-a');
    cy.url().should('include', '/direction-none-back/a');
  });

});
