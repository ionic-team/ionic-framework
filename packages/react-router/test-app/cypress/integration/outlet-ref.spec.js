const port = 3000;

describe('IonRouterOutlet Ref', () => {
  /*
    This spec tests that setting a ref on an IonRouterOutlet works
  */

  it('/outlet-ref, page should contain the id of the ion-router-outlet', () => {
    cy.visit(`http://localhost:${port}/outlet-ref`);
    cy.get('div').contains('main-outlet');
    cy.ionPageVisible('main');
  });
});
