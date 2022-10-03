describe('Hardware Back Button', () => {
  it('should correctly go back to Tab 1', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.get('#add-tab').click();

    cy.get('ion-tab-button#tab-button-tab4').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab4');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab4');
    cy.ionPageVisible('tab1');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab4');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab4');
    cy.ionPageVisible('tab2');

    cy.hardwareBackButton();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1');
  });

  it('should correctly go back to the root tab from child pages', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/tabs');
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.routerPush('/tabs/tab1/childtwo');
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1childtwo');
    cy.ionPageVisible('tab1childone');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1');
    cy.ionPageVisible('home');
  });

  // TODO FW-1389
  it.skip('should correctly go back to the root tab after switching pages', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/tabs');
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.routerPush('/tabs/tab1/childtwo');
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1childtwo');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1childtwo');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1childtwo');
    cy.ionPageVisible('tab1childone');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');

    cy.hardwareBackButton();
    cy.ionPageDoesNotExist('tab1');
    cy.ionPageVisible('home');
  });
})
