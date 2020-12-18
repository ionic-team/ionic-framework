const port = 3000;

describe('Tab Context', () => {
  /*
    This spec tests the IonTabsContext API
  */

  it('/tab-context > Go to tab2 > should be on tab2', () => {
    cy.visit(`http://localhost:${port}/tab-context`);
    cy.ionPageVisible('tab1');
    cy.get('div').contains('Page: tab1');
    cy.ionNav('ion-button', 'Go to tab2');
    cy.ionPageVisible('tab2');
    cy.get('div').contains('Page: tab2');
  });

  it('/tab-context/tab1 > Go to tab1 > should be on tab1', () => {
    cy.visit(`http://localhost:${port}/tab-context/tab2`);
    cy.ionPageVisible('tab2');
    cy.get('div').contains('Page: tab2');
    cy.ionNav('ion-button', 'Go to tab1');
    cy.ionPageVisible('tab1');
    cy.get('div').contains('Page: tab1');
  });
});
