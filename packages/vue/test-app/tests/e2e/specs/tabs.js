describe('Tabs', () => {
  it('should go back from child pages', () => {
    cy.visit('http://localhost:8080/tabs')

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
    cy.visit('http://localhost:8080/tabs')

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
    cy.visit('http://localhost:8080/tabs')

    cy.get('#child-one').click();

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1childone');

    cy.go('back');

    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');
  });

  // TODO this does not work
  it.skip('should return to tab root when clicking tab button', () => {
    cy.visit('http://localhost:8080/tabs')

    cy.get('#child-one').click();
    cy.get('#child-two').click();

    cy.get('ion-tab-button#tab-button-tab1').click();

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
    cy.ionPageDoesNotExist('tab1childtwo');
  })

  it('should be able to create and destroy tabs', () => {
    cy.visit('http://localhost:8080')

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');

    cy.get('#tabs').click();
    cy.ionPageVisible('tab1');

    cy.ionBackClick('tab1');
    cy.ionPageDoesNotExist('tabs');
  });
})

describe('Tabs - Swipe to Go Back', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('http://localhost:8080?ionic:mode=ios');
    cy.get('#tabs').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1')
  });

  it('should swipe and abort', () => {
    cy.ionSwipeToGoBack();
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1');
  });

  it('should swipe and go back to home', () => {
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

  it('should swipe and go back within a tab', () => {
    cy.get('#child-one').click();
    cy.ionPageVisible('tab1childone');
    cy.ionPageHidden('tab1');

    cy.ionSwipeToGoBack(true, 'ion-tabs#tabs ion-router-outlet');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1childone');
  });

  it('should swipe and go back to correct tab after switching tabs', () => {
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
    cy.visit('http://localhost:8080/tabs')

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
