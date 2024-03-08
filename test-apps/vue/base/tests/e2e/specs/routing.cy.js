describe('Routing', () => {
  it('should go to sibling page', () => {
    cy.visit('/');
    cy.ionPageVisible('home');
    cy.get('ion-item#routing').click();

    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');
  });

  it('should set query params and keep view in stack', () => {
    cy.visit('/routing');
    cy.ionPageVisible('routing');
    cy.get('#route-params').click();
    cy.ionPageVisible('routing');
  });

  it('should go back home', () => {
    cy.visit('/');
    cy.ionPageVisible('home');
    cy.get('ion-item#routing').click();

    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
  });

  it('should go back home with default href', () => {
    cy.visit('/default-href');
    cy.ionPageVisible('defaulthref');

    cy.ionBackClick('defaulthref');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('defaulthref');
  });

  it('should show back button', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.get('#routing').click();
    cy.get('#child').click();

    cy.ionBackClick('routingchild');
    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageDoesNotExist('routingchild')
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should navigate to multiple pages that match the same parameterized route', () => {
    cy.visit('/routing');
    cy.ionPageVisible('routing');

    cy.get('#parameter-abc').click();
    cy.ionPageVisible('routingparameter-abc');
    cy.get('[data-pageid=routingparameter-abc] #parameter-value').should('have.text', 'abc');
    cy.ionBackClick('routingparameter-abc');

    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.get('#parameter-xyz').click();
    cy.ionPageVisible('routingparameter-xyz');
    cy.get('[data-pageid=routingparameter-xyz] #parameter-value').should('have.text', 'xyz');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should handle parameterized urls properly', () => {
    cy.visit('/routing');
    cy.ionPageVisible('routing');

    cy.get('#parameter-abc').click();
    cy.ionPageVisible('routingparameter-abc');

    cy.get('#parameter-view').click();

    cy.ionPageVisible('routingparameterview');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22324
  it('should show correct view when navigating back from parameterized page to query string page', () => {
    cy.visit('/routing');
    cy.ionPageVisible('routing');
    cy.get('#route-params').click();
    cy.get('#parameter-view-item').click();

    cy.ionPageVisible('routingparameterview');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingparameterview');

    cy.ionPageDoesNotExist('routingparameterview');
    cy.ionPageVisible('routing');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should work properly with async navigation guards', () => {
    cy.visit('/');
    cy.ionPageVisible('home');
    cy.get('#delayed-redirect').click();

    cy.get('ion-loading').should('exist');

    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22412
  it('should correctly replace route in a component', () => {
    cy.visit('/routing?ionic:mode=ios');
    cy.ionPageVisible('routing');
    cy.get('#replace').click();

    cy.ionPageVisible('navigation');
    cy.ionPageDoesNotExist('routing');

    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('navigation');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22654
  it('should show correct view when navigating between parameter urls', () => {
    cy.visit('/nested');
    cy.ionPageVisible('nestedchild');

    cy.get('[data-pageid="routeroutlet"] #trash').click();
    cy.ionPageVisible('folder');

    cy.get('[data-pageid="routeroutlet"] #outbox').click();
    cy.ionPageVisible('folder');

    cy.get('[data-pageid="routeroutlet"] #other').click();
    cy.ionPageVisible('nestedchildtwo');
    cy.ionPageDoesNotExist('folder');

    cy.get('[data-pageid="routeroutlet"] #spam').click();
    cy.ionPageVisible('folder');
    cy.ionPageDoesNotExist('nestedchildtwo');

    cy.get('[data-pageid="routeroutlet"] #outbox').click();
    cy.ionPageVisible('folder');

    cy.get('[data-pageid="routeroutlet"] #other').click();
    cy.ionPageVisible('nestedchildtwo');
    cy.ionPageDoesNotExist('folder');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22658
  it('should select correct leaving view when navigating between parameter urls', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing/123');
    cy.ionPageVisible('routingparameter-123');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/456');
    cy.ionPageVisible('routingparameter-456');
    cy.ionPageHidden('home');

    cy.routerPush('/navigation');
    cy.ionPageVisible('navigation');
    cy.ionPageHidden('routingparameter-456');

    cy.routerPush('/routing/789');
    cy.ionPageVisible('routingparameter-789');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/000');
    cy.ionPageVisible('routingparameter-000');
    cy.ionPageHidden('home');

    cy.routerPush('/navigation');
    cy.ionPageVisible('navigation');
    cy.ionPageHidden('routingparameter-000');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22528
  it('should not show ion-back-button when replacing to root page', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/navigation');
    cy.ionPageVisible('navigation');
    cy.ionPageHidden('home');

    cy.routerReplace('/');
    cy.ionPageDoesNotExist('navigation');
    cy.ionPageVisible('home');

    cy.ionBackButtonHidden('home');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22662
  it('should push a new instance of a parameterized page so there is a transition', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing/123');
    cy.ionPageVisible('routingparameter-123');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/456');
    cy.ionPageVisible('routingparameter-456');
    cy.ionPageHidden('routingparameter-123');

    cy.ionBackClick('routingparameter-456');

    cy.ionPageVisible('routingparameter-123')
    cy.ionPageDoesNotExist('routingparameter-456');
  });

  it('should select correct view when using router.go()', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.routerGo(2);
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('home');

    cy.ionBackClick('routingparameter-abc');
    cy.ionPageDoesNotExist('routingparameter-abc');
    cy.ionPageVisible('routing');
  })

  it('should select correct view when traversing backward and forward through history', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.routerGo(1);
    cy.ionPageHidden('home');
    cy.ionPageVisible('routing');

    cy.routerGo(1);
    cy.ionPageHidden('routing');
    cy.ionPageVisible('routingparameter-abc');

    cy.routerGo(-1);
    cy.ionPageDoesNotExist('routingparameter-abc');
    cy.ionPageVisible('routing');

    cy.routerGo(-1);
    cy.ionPageDoesNotExist('routing');
    cy.ionPageVisible('home');
  })

  it('should create new stack items when going back then pushing pages', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.routerPush('/inputs');
    cy.ionPageHidden('home');
    cy.ionPageVisible('inputs');

    cy.ionBackClick('inputs');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('inputs');
  })

  it('should properly go back using ion-back-button after using router.go()', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.routerGo(2);
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('home');

    cy.ionBackClick('routingparameter-abc');
    cy.ionPageDoesNotExist('routingparameter-abc');
    cy.ionPageVisible('routing');

    cy.ionBackClick('routing');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageVisible('home');
  });

  it('should unmount views skipped over by using router.go with a negative value', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageDoesNotExist('routingparameter-abc');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23987
  it('should choose correct view when navigating back', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/123/view');
    cy.ionPageVisible('routingparameterview');
    cy.ionPageHidden('routing');

    cy.routerPush('/routing/child');
    cy.ionPageVisible('routingchild');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingchild');
    cy.ionPageVisible('routingparameterview');
    cy.ionPageDoesNotExist('routingchild');

    cy.ionBackClick('routingparameterview');
    cy.ionPageVisible('routing');
    cy.ionPageDoesNotExist('routingparameterview');

    cy.ionBackClick('routing');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/456/view');
    cy.ionPageVisible('routingparameterview');
    cy.ionPageHidden('routing');

    cy.routerPush('/routing/child');
    cy.ionPageVisible('routingchild');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingchild');
    cy.ionPageVisible('routingparameterview');
    cy.ionPageDoesNotExist('routingchild');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/24226
  it('should correctly replace a route after popping', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerGo(-1);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');

    cy.routerReplace('/inputs');
    cy.ionPageVisible('inputs');
    cy.ionPageDoesNotExist('home');

    cy.routerPush('/');
    cy.ionPageVisible('home');
    cy.ionPageHidden('inputs');
  })

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/23873
  it('should correctly show pages after going back to defaultHref page', () => {
    cy.visit('/default-href');
    cy.ionPageVisible('defaulthref');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('defaulthref');

    cy.ionBackClick('routing');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageVisible('defaulthref');

    cy.ionBackClick('defaulthref');
    cy.ionPageDoesNotExist('defaulthref');
    cy.ionPageVisible('home');

    cy.routerPush('/default-href');
    cy.ionPageVisible('defaulthref');
    cy.ionPageHidden('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('defaulthref');

    cy.ionBackClick('routing');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageVisible('defaulthref');

    cy.ionBackClick('defaulthref');
    cy.ionPageDoesNotExist('defaulthref');
    cy.ionPageVisible('home');
  })

  it('should correctly update location history after rewriting past state', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/inputs');
    cy.ionPageVisible('inputs');
    cy.ionPageHidden('routing');

    cy.ionBackClick('inputs');
    cy.ionPageVisible('routing');
    cy.ionPageDoesNotExist('inputs');

    cy.ionBackClick('routing');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');

    cy.routerPush('default-href');
    cy.ionPageVisible('defaulthref');
    cy.ionPageHidden('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('defaulthref');

    cy.routerPush('/inputs');
    cy.ionPageVisible('inputs');
    cy.ionPageHidden('routing');

    cy.ionBackClick('inputs');
    cy.ionPageVisible('routing');
    cy.ionPageDoesNotExist('inputs');

    cy.ionBackClick('routing');
    cy.ionPageVisible('defaulthref');
    cy.ionPageDoesNotExist('routing');
  })

  it('should correctly update location history after setting root state', () => {
    cy.visit('/');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/1');
    cy.ionPageVisible('routingparameter-1');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingparameter-1');
    cy.ionPageVisible('routing');
    cy.ionPageDoesNotExist('routingparameter-1');

    cy.ionBackClick('routing');
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');

    cy.ionRouterNavigate('/inputs', 'root')
    cy.ionPageVisible('inputs');
    cy.ionPageDoesNotExist('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('inputs');

    cy.routerPush('/routing/1');
    cy.ionPageVisible('routingparameter-1');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingparameter-1');
    cy.ionPageVisible('routing');
    cy.ionPageDoesNotExist('routingparameter-1');

    cy.ionBackClick('routing');
    cy.ionPageVisible('inputs');
    cy.ionPageDoesNotExist('routing');
  })
});

describe('Routing - Swipe to Go Back', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('?ionic:mode=ios');
    cy.ionPageVisible('home');
    cy.get('#routing').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('routing')
  });

  it('should swipe and abort', () => {
    cy.ionSwipeToGoBack();
    cy.ionPageHidden('home');
    cy.ionPageVisible('routing');
  });

  it('should swipe and complete', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');

    // TODO: Vue router does not go back in cypress with router.back()
    //cy.ionPageDoesNotExist('navigation');
  });

  it.skip('swipe to go back should work when using router.go()', () => {
    cy.visit('?ionic:mode=ios');
    cy.ionPageVisible('home');

    cy.routerPush('/routing');
    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.routerPush('/routing/abc');
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('routing');

    cy.routerGo(-2);
    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routingparameter-abc');

    cy.routerGo(2);
    cy.ionPageVisible('routingparameter-abc');
    cy.ionPageHidden('home');

    // TODO: This does not work yet
    cy.ionSwipeToGoBack(true);

    cy.ionPageDoesNotExist('routingparameter-abc');
    cy.ionPageVisible('routing');
  })
})
