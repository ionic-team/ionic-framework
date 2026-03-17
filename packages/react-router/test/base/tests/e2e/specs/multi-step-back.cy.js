const port = 3000;

/**
 * Tests for navigate(-n) where n > 1 (multi-step back navigation).
 * Verifies that the correct view is shown when skipping multiple
 * entries in the history stack.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/23775
 */
describe('Multi-Step Back Navigation (#23775)', () => {

  it('A > B > C > navigate(-2) should show Page A', () => {
    cy.visit(`http://localhost:${port}/multi-step-back/a`);
    cy.ionPageVisible('multi-step-page-a');

    // Navigate A -> B -> C
    cy.ionNav('ion-button#go-to-b', 'Go to Page B');
    cy.ionPageVisible('multi-step-page-b');

    cy.ionNav('ion-button#go-to-c', 'Go to Page C');
    cy.ionPageVisible('multi-step-page-c');

    // navigate(-2) should go back to Page A, skipping Page B
    cy.ionNav('ion-button#page-c-go-back-2', 'Go Back 2 (to A)');
    cy.ionPageVisible('multi-step-page-a');
    cy.url().should('include', '/multi-step-back/a');
  });

  it('A > B > C > D > navigate(-2) should show Page B', () => {
    cy.visit(`http://localhost:${port}/multi-step-back/a`);
    cy.ionPageVisible('multi-step-page-a');

    // Navigate A -> B -> C -> D
    cy.ionNav('ion-button#go-to-b', 'Go to Page B');
    cy.ionPageVisible('multi-step-page-b');

    cy.ionNav('ion-button#go-to-c', 'Go to Page C');
    cy.ionPageVisible('multi-step-page-c');

    cy.ionNav('ion-button#go-to-d', 'Go to Page D');
    cy.ionPageVisible('multi-step-page-d');

    // navigate(-2) from D should show Page B
    cy.ionNav('ion-button#page-d-go-back-2', 'Go Back 2 (to B)');
    cy.ionPageVisible('multi-step-page-b');
    cy.url().should('include', '/multi-step-back/b');
  });

  it('A > B > C > D > navigate(-3) should show Page A', () => {
    cy.visit(`http://localhost:${port}/multi-step-back/a`);
    cy.ionPageVisible('multi-step-page-a');

    // Navigate A -> B -> C -> D
    cy.ionNav('ion-button#go-to-b', 'Go to Page B');
    cy.ionPageVisible('multi-step-page-b');

    cy.ionNav('ion-button#go-to-c', 'Go to Page C');
    cy.ionPageVisible('multi-step-page-c');

    cy.ionNav('ion-button#go-to-d', 'Go to Page D');
    cy.ionPageVisible('multi-step-page-d');

    // navigate(-3) from D should show Page A
    cy.ionNav('ion-button#page-d-go-back-3', 'Go Back 3 (to A)');
    cy.ionPageVisible('multi-step-page-a');
    cy.url().should('include', '/multi-step-back/a');
  });

  it('A > B > C > navigate(-2) > Browser Forward should show Page B', () => {
    cy.visit(`http://localhost:${port}/multi-step-back/a`);
    cy.ionPageVisible('multi-step-page-a');

    // Navigate A -> B -> C
    cy.ionNav('ion-button#go-to-b', 'Go to Page B');
    cy.ionPageVisible('multi-step-page-b');

    cy.ionNav('ion-button#go-to-c', 'Go to Page C');
    cy.ionPageVisible('multi-step-page-c');

    // navigate(-2) back to Page A
    cy.ionNav('ion-button#page-c-go-back-2', 'Go Back 2 (to A)');
    cy.ionPageVisible('multi-step-page-a');
    cy.url().should('include', '/multi-step-back/a');

    // Browser forward should go to Page B (one step forward from A)
    cy.ionGoForward('/multi-step-back/b');
    cy.ionPageVisible('multi-step-page-b');

    // A second forward step from B should reach Page C
    cy.ionGoForward('/multi-step-back/c');
    cy.ionPageVisible('multi-step-page-c');
  });

});
