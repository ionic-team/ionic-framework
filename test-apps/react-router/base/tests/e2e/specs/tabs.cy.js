const port = 3000;

describe('Tabs', () => {
  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23101
  it('should return to previous tab instance when using the ion-back-button', () => {
    cy.visit(`http://localhost:${port}/tabs/tab1`);

    cy.get('#tabs-secondary').click();
    cy.ionPageVisible('tab1-secondary');

    cy.get('ion-tab-button#tab-button-tab2-secondary').click();
    cy.ionPageHidden('tab1-secondary');
    cy.ionPageVisible('tab2-secondary');

    cy.get('ion-tab-button#tab-button-tab1-secondary').click();
    cy.ionPageHidden('tab2-secondary');
    cy.ionPageVisible('tab1-secondary');

    cy.ionBackClick('tab1-secondary');
    cy.ionPageDoesNotExist('tabs-secondary');
    cy.ionPageVisible('tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23087
  it('should return to correct view and url when going back from child page after switching tabs', () => {
    cy.visit(`http://localhost:${port}/tabs/tab1`);

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1child1');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1child1');

    cy.ionBackClick('tab1child1');
    cy.ionPageDoesNotExist('tab1child1');
    cy.ionPageVisible('tab1');

    cy.url().should('include', '/tabs/tab1');
  });
});
