const port = 3000;

describe('Dynamic Tabs', () => {
  /*
    This spec tests being able to add a tab at runtime and to be able to go to it
    Fixes bug https://github.com/ionic-team/ionic/issues/21112
  */

  it('/dynamic-tabs > Tab 1 should be visible', () => {
    cy.visit(`http://localhost:${port}/dynamic-tabs`);
    cy.ionPageVisible('Tab1');
  });

  it('/dynamic-tabs > Add Tab 2 Button Click > Tab2 Tab, Tab2 should be visible', () => {
    cy.visit(`http://localhost:${port}/dynamic-tabs`);
    cy.ionPageVisible('Tab1');
    cy.get('ion-button').contains('Add Tab 2').click();
    cy.ionTabClick('Tab 2');
    cy.ionPageVisible('Tab2');
  });

  it('/dynamic-tabs/tab2 > Default route should kick back to Tab 1', () => {
    cy.visit(`http://localhost:${port}/dynamic-tabs/tab2`);
    cy.ionPageVisible('Tab1');
  });
});
