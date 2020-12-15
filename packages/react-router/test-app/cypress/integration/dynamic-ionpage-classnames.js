const port = 3000;

describe('Dynamic IonPage Classnames', () => {
  /*
    This spec tests that classnames can be added to IonPages dynamically and that the IonPage
    doesn't get ion-page-invisible added back to it when it does change
    Fixes bug reported in https://github.com/ionic-team/ionic-framework/issues/22631
  */

  it('/dynamic-ionpage-classnames, when a class is added to an IonPage, the class should be applied to the element and the page should still be visible', () => {
    cy.visit(`http://localhost:${port}/dynamic-ionpage-classnames`);
    cy.ionPageVisible('dynamic-ionpage-classnames');
    cy.get('.initial-class');
    cy.contains('Add Class').click();
    cy.get('.other-class');
    cy.ionPageVisible('dynamic-ionpage-classnames');
  });
});
