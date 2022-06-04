const port = 3000;

describe('Swipe To Go Back', () => {
  /*
    This spec tests that swipe to go back works
  */

  it('/swipe-to-go-back, ', () => {
    cy.visit(`http://localhost:${port}/swipe-to-go-back`);
    cy.ionPageVisible('main');
    cy.ionNav('ion-item', 'Details');
    cy.ionPageVisible('details');
    cy.ionPageHidden('main');
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('main');
  });
});
