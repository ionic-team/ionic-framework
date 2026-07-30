const port = 3000;

describe('Replace Action', () => {
  /*
    This spec tests that when a 'replace' action is used, that it does replace the current
    history item in location history.
  */

  it('/replace-action > Goto Page2 > Goto Page3 > Browser Back > Page1 should be visible and Page2 should be gone', () => {
    cy.visit(`http://localhost:${port}/replace-action`);
    cy.ionPageVisible('page1');
    cy.ionNav('ion-button', 'Goto Page2');
    cy.ionPageVisible('page2');
    cy.ionNav('ion-button', 'Goto Page3');
    cy.ionPageVisible('page3');
    cy.go('back');
    cy.ionPageVisible('page1');
    cy.ionPageDoesNotExist('page2');
  });

  /**
   * Tests that the browser forward button works after going back from a
   * replace-navigated page. When going back uses navigate(-1) (native browser
   * back), the forward entry is preserved in the browser history stack.
   * If it falls through to handleNavigate (replace-based), forward is broken.
   */
  it('/replace-action > Goto Page2 > Goto Page3 > Browser Back > Browser Forward > Page3 should be visible', () => {
    cy.visit(`http://localhost:${port}/replace-action`);
    cy.ionPageVisible('page1');
    cy.ionNav('ion-button', 'Goto Page2');
    cy.ionPageVisible('page2');
    cy.ionNav('ion-button', 'Goto Page3');
    cy.ionPageVisible('page3');
    cy.go('back');
    cy.ionPageVisible('page1');
    cy.go('forward');
    cy.ionPageVisible('page3');
  });
});
