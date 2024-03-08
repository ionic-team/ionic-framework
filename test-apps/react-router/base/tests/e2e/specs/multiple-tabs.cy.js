const port = 3000;

describe('Multiple Tabs', () => {
  /*
    This spec tests that switching between tabs via a menu works
    Fixes bug https://github.com/ionic-team/ionic/issues/21336
  */

  it('/multiple-tabs > PageA should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`);
    cy.ionPageVisible('PageA');
  });

  it('/multiple-tabs > Page B Tab, PageB should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`);
    cy.ionPageVisible('PageA');
    cy.ionTabClick('Page B');
    cy.ionPageVisible('PageB');
  });

  it('/multiple-tabs > Menu > Tab 2, Page C should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`);
    cy.ionPageVisible('PageA');
    cy.ionMenuClick();
    cy.ionMenuNav('Tab 2');
    cy.ionPageVisible('PageC');
  });

  it('/multiple-tabs > Page B Tab > Menu > Tab 2, Page D, Menu > Tab 1, Page A should be visible', () => {
    cy.visit(`http://localhost:${port}/multiple-tabs`);
    cy.ionPageVisible('PageA');
    cy.ionTabClick('Page B');
    cy.ionPageVisible('PageB');
    cy.ionMenuClick();
    cy.ionMenuNav('Tab 2');
    cy.ionPageVisible('PageC');
    cy.ionTabClick('Page D');
    cy.ionPageVisible('PageD');
    cy.ionMenuClick();
    cy.ionMenuNav('Tab 1');
    cy.ionPageVisible('PageA');
  });
});
