const port = 3000;
const IOS_MODE = 'ionic:mode=ios';

describe('Swipe To Go Back', () => {
  /*
    This spec tests that swipe to go back works
  */

  it('should swipe and abort', () => {
    cy.visit(`http://localhost:${port}/swipe-to-go-back?${IOS_MODE}`);
    cy.ionPageVisible('main');

    cy.ionNav('ion-item', 'Details');
    cy.ionPageVisible('details');
    cy.ionPageHidden('main');

    cy.ionSwipeToGoBack(false, 'ion-router-outlet#swipe-to-go-back');
    cy.ionPageVisible('details');
    cy.ionPageHidden('main');
  });

  it('should swipe and go back', () => {
    cy.visit(`http://localhost:${port}/swipe-to-go-back?${IOS_MODE}`);
    cy.ionPageVisible('main');

    cy.ionNav('ion-item', 'Details');
    cy.ionPageVisible('details');
    cy.ionPageHidden('main');

    cy.ionSwipeToGoBack(true, 'ion-router-outlet#swipe-to-go-back');
    cy.ionPageVisible('main');
  });

  it('should swipe and abort within a tab', () => {
    cy.visit(`http://localhost:${port}/tabs/tab1?${IOS_MODE}`);
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.ionSwipeToGoBack(false, 'ion-tabs ion-router-outlet');

    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1')
  });

  it('should swipe and go back within a tab', () => {
    cy.visit(`http://localhost:${port}/tabs/tab1?${IOS_MODE}`);
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1child1')
  });

  it('should swipe and go back to correct tab after switching tabs', () => {
    cy.visit(`http://localhost:${port}?${IOS_MODE}`);
    cy.ionPageVisible('home');

    cy.get('#go-to-tabs').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('tab1');
    cy.ionPageVisible('tabs');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1child1');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1child1');
    cy.ionPageHidden('tab2');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');

    cy.ionPageVisible('tab1');
    cy.ionPageDoesNotExist('tab1child1');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('tabs');
  });

  it('should be able to swipe back from child tab page after visiting', () => {
    cy.visit(`http://localhost:${port}/tabs/tab1?${IOS_MODE}`);
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.get('#child-two').click();
    cy.ionPageHidden('tab1child1');
    cy.ionPageVisible('tab1child2');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');

    cy.ionPageDoesNotExist('tab1child2');
    cy.ionPageVisible('tab1child1');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');

    cy.ionPageDoesNotExist('tab1child1');
    cy.ionPageVisible('tab1');

    cy.get('#child-one').click();
    cy.ionPageHidden('tab1');
    cy.ionPageVisible('tab1child1');

    cy.ionSwipeToGoBack(true, 'ion-tabs ion-router-outlet');

    cy.ionPageDoesNotExist('tab1child1');
    cy.ionPageVisible('tab1');
  })

  it('should not swipe to go back to the same view you are on', () => {
    cy.visit(`http://localhost:${port}?${IOS_MODE}`);
    cy.ionPageVisible('home');

    cy.ionSwipeToGoBack(false);
    cy.ionPageVisible('home');
  })

  it('should not hide a parameterized page when swiping and aborting', () => {
    cy.visit(`http://localhost:${port}/params/0?${IOS_MODE}`);
    cy.ionPageVisible('params-0');

    cy.get('#next-page').click();
    cy.ionPageVisible('params-1');

    cy.ionSwipeToGoBack(false);

    cy.ionPageVisible('params-1');
  })
});
