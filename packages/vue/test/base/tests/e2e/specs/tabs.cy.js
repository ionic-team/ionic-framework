describe('Tabs', () => {
  it('should go back from child pages', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.get('#child-two').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.ionBackClick('tab1childtwo');
    cy.ionBackClick('tab1childone');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  });

  it('should go back to child page when switching tabs', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageHidden('tab2');
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();
  });

  it('should go to correct tab when going back via browser', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1childone');

    cy.go('back');

    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');
  });

  it('should return to tab root when clicking tab button after going back', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('#child-two').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageVisible('tab1');

    // TODO(FW-1420)
    //cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24934
  it('should return to tab root when clicking tab button', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('#child-two').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab1childtwo');

    cy.ionBackClick('tab1childtwo');
    cy.ionPageVisible('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1chilone');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24934
  it('should return to tab root after replacing history', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1chilone');

    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1chilone');
  })

  it('should be able to create and destroy tabs', () => {
    cy.visit('/')
    cy.ionPageVisible('home');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('home');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('home');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');
  });

  it('should go back from a tabs page to a non-tabs page using ion-back-button', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');

    cy.ionBackClick('tab2');
    cy.ionPageVisible('home')
    cy.ionPageDoesNotExist('tabs');
  });

  it('should properly clear stack when leaving tabs', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');

    cy.ionBackClick('tab2');
    cy.ionPageVisible('home')
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22344
  it('should show tab 1 when redirecting from tab 3', () => {
    cy.visit('/tabs/tab3');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab3');
    cy.ionPageVisible('tabs');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22307
  it('should select correct tab after going back', () => {
    cy.visit('/tabs-secondary/tab1');
    cy.ionPageVisible('tab1-secondary');

    cy.get('ion-tab-button#tab-button-tab2-secondary').click();
    cy.ionPageVisible('tab2-secondary');
    cy.ionPageHidden('tab1-secondary');

    cy.get('ion-tab-button#tab-button-tab3-secondary').click();
    cy.ionPageVisible('tab3-secondary');
    cy.ionPageHidden('tab2-secondary');

    cy.go('back');
    cy.ionPageVisible('tab2-secondary');
    cy.ionPageHidden('tab3-secondary');

    cy.go('back');
    cy.ionPageVisible('tab1-secondary');
    cy.ionPageHidden('tab2-secondary');

    cy.get('ion-tab-button#tab-button-tab3-secondary').click();
    cy.ionPageVisible('tab3-secondary');
    cy.ionPageHidden('tab1-secondary');
  });

  // Verifies 1 of 2 fixes for https://github.com/ionic-team/ionic-framework/issues/22519
  it('should show correct tab when switching between tabbed and non-tabbed contexts', () => {
    cy.visit('/routing');
    cy.ionPageVisible('routing');

    cy.get('[data-pageid="routing"] #tab1').click();
    cy.ionPageHidden('routing');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.get('[data-pageid="tab2"] #routing').click();
    cy.ionPageVisible('routing');
    cy.ionPageHidden('tabs');

    cy.get('[data-pageid="routing"] #tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('routing');
    cy.ionPageHidden('tab2');
  });

  // Verifies 1 of 2 fixes for https://github.com/ionic-team/ionic-framework/issues/22519
  it('should not create a new tabs instance when switching between tabbed and non-tabbed contexts', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.routerPush('/');
    cy.ionPageHidden('tabs');
    cy.ionPageVisible('home');

    cy.routerPush('/tabs/tab2');
    cy.ionPageHidden('tab1');

    cy.ionPageHidden('home');

    cy.ionPageVisible('tab2');
    cy.ionPageVisible('tabs');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22597
  it('should deselect old tab button when going to a tab that does not have a tab button', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab1').should('have.class', 'tab-selected');

    cy.routerPush('/tabs/tab4');
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab4');

    cy.get('ion-tab-button#tab-button-tab1').should('not.have.class', 'tab-selected');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23101
  it('should return to previous tab instance when using the ion-back-button', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('#tabs-secondary').click();
    cy.ionPageHidden('tabs');
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
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1childone');

    cy.ionBackClick('tab1childone');
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');

    cy.url().should('include', '/tabs/tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22847
  it('should support dynamic tabs', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button').its('length').should('equal', 3);
    cy.get('ion-tab-button#tab-button-tab1').should('have.class', 'tab-selected');

    cy.get('#add-tab').click();

    cy.get('ion-tab-button').its('length').should('equal', 4);

    cy.get('ion-tab-button#tab-button-tab4').click();
    cy.ionPageVisible('tab4');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab1').should('not.have.class', 'tab-selected');
    cy.get('ion-tab-button#tab-button-tab4').should('have.class', 'tab-selected');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23699
  it('should preserve query string when switching tabs', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('#child-one-query-string').click();
    cy.ionPageVisible('tab1child-one');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1child-one');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1child-one');
    cy.ionPageHidden('tab2');

    cy.url().should('include', '/tabs/tab1/child-one?key=value');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24353
  it('should handle clicking tab multiple times without query string', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('tab2');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24332
  it('should not unmount tab 1 when leaving tabs context', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    // Dynamically add tab 4 because tab 3 redirects to tab 1
    cy.get('#add-tab').click();

    cy.get('ion-tab-button#tab-button-tab4').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab4');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab4');
    cy.ionPageVisible('tab2');

    cy.get('[data-pageid="tab2"] #routing').click();
    cy.ionPageVisible('routing');
    cy.ionPageHidden('tabs');

    cy.ionBackClick('routing');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageVisible('tabs');
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24654
  it('should not error when going back to a tabs view from a non tabs view', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.routerGo(-1);
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childtwo');
    cy.ionPageVisible('tab1childtwo');
    cy.ionPageHidden('tab1');

    cy.routerPush('/inputs');
    cy.ionPageVisible('tab1childtwo');
    cy.ionPageHidden('tabs');

    cy.routerGo(-1);
    cy.ionPageDoesNotExist('inputs');
    cy.ionPageVisible('tab1childtwo');
    cy.ionPageVisible('tabs');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24432
  it('should properly reset location history when switching tabs after going back', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.ionRouterBack();
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');

    cy.ionRouterBack();
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab2');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24432
  it('should correctly replace a route in a child tab route', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.ionRouterReplace('/tabs/tab1');
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24859
  it('should go back to the root page after navigating between tab and non tab outlets', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/tabs/tab1');
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('home');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('tabs');

    cy.routerPush('/tabs/tab1');
    cy.ionPageVisible('tabs');
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('routing');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.ionBackClick('tab2');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('tabs');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24936
  it('should correctly go back after changing tabs', () => {
    cy.visit('/tabs/tab1');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.routerPush('/tabs/tab1/childtwo');
    cy.ionPageVisible('tab1childtwo');
    cy.ionPageHidden('tab1childone');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1childtwo');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1childtwo');

    cy.ionBackClick('tab1childtwo');
    cy.ionPageVisible('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');

    cy.ionBackClick('tab1childone');
    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24303
  it('should correctly perform router.go without errors after navigating into tabs', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/inputs');
    cy.ionPageVisible('inputs');
    cy.ionPageHidden('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('inputs');

    cy.routerPush('/tabs/tab1');
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('routing');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1');

    cy.routerGo(-1);
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/25255
  it('should not error when going back to root tab multiple times', () => {
    cy.visit('/tabs');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1');

    cy.routerPush('/tabs/tab1/childone');
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageHidden('tab1childone');
    cy.ionPageVisible('tab2');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageHidden('tab2');
    cy.ionPageVisible('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageVisible('tab1');
  })
})

describe('Tabs - Swipe to Go Back', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('?ionic:mode=ios');
    cy.ionPageVisible('home');
    cy.get('#tabs').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1')
  });

  // TODO: Flaky if test runner is slow
  // Delays between gesture movements
  // cause swipe back gesture to think
  // velocity is higher than it actually is
  /*it('should swipe and abort', () => {
    cy.ionSwipeToGoBack();
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1');
  });*/

  it.skip('should swipe and go back to home', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');

    // TODO: Vue router does not go back in cypress with router.back()
    //cy.ionPageDoesNotExist('tabs1');
  });

  it('should swipe and abort within a tab', () => {
    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.ionSwipeToGoBack(false, 'ion-tabs#tabs ion-router-outlet');

    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1childone');
  });

  it.skip('should swipe and go back within a tab', () => {
    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.ionSwipeToGoBack(true, 'ion-tabs#tabs ion-router-outlet');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
  });

  it.skip('should swipe and go back to correct tab after switching tabs', () => {
    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1childone');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab2');

    cy.ionSwipeToGoBack(true, 'ion-tabs#tabs ion-router-outlet');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');

    cy.ionSwipeToGoBack(true, 'ion-tabs#tabs ion-router-outlet');
    cy.ionPageVisible('home');
  });
})

describe('Multi Tabs', () => {
  it('should navigate to multiple tabs instances', () => {
    cy.visit('/tabs')

    cy.get('#tabs-secondary').click();
    cy.ionPageHidden('tabs');
    cy.ionPageVisible('tabs-secondary');

    cy.get('[data-pageid="tab1-secondary"] #tabs-primary').click();
    cy.ionPageHidden('tabs-secondary');
    cy.ionPageVisible('tabs');

    cy.ionBackClick('tab1');
    cy.ionPageVisible('tabs-secondary');
    cy.ionPageDoesNotExist('tabs');

    cy.ionBackClick('tab1-secondary');
    cy.ionPageVisible('tabs');
    cy.ionPageDoesNotExist('tabs-secondary');

    cy.ionBackClick('tab1');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('tabs');
  });
})
