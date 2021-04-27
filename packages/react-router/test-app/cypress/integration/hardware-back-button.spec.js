const port = 3000;

describe('Android hardware back button', () => { 
  it('The hardware back button should only travel back one page at a time', () => {
    /*
      The following is copied from ./routing.spec.js
      cy.ionBackClick is replaced with cy.ionHardwareBackEvent
    */
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Settings');
    cy.ionNav('ion-item', 'Settings Details 1');
    cy.ionNav('ion-button', 'Go to Settings Details 2');
    cy.ionNav('ion-button', 'Go to Settings Details 3');
    cy.contains('[data-pageid=settings-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Home');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionHardwareBackEvent();
    cy.contains('[data-pageid=home-details-page-2] ion-label', 'Details 2');
    cy.ionHardwareBackEvent();
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
    cy.ionHardwareBackEvent();
    cy.ionPageVisible('home-page');
  });
});