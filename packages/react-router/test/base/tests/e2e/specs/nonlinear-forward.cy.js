const port = 3000;

describe('Non-linear POP Forward Navigation', () => {
  // Tests browser forward after a non-linear POP (back from a route without pushedByRoute).

  it('Home > D1 > Settings Tab > Browser Back > Browser Forward, should correctly detect forward after non-linear POP back', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');

    // Navigate to Details 1 (PUSH - creates route with pushedByRoute)
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');

    // Switch to Settings tab (PUSH with direction 'none' - creates route WITHOUT pushedByRoute)
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');

    // Browser back - this is a non-linear POP because settings route has no pushedByRoute.
    // The else branch should push the current location key onto forwardStack.
    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');
    cy.get('ion-tab-button.tab-selected').contains('Home');

    // Browser forward - should be detected as forward navigation via forwardStack.
    // Without the fix, forwardStack is empty so this falls into the wrong branch
    // (else-if, treating it as back navigation with wrong animation).
    cy.ionGoForward('/routing/tabs/settings');
    cy.ionPageVisible('settings-page');
    cy.get('ion-tab-button.tab-selected').contains('Settings');
  });

  it('Home > D1 > Settings Tab > Browser Back > Browser Forward > Browser Back, forward stack should not be corrupted', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');

    // Build navigation stack
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');

    // Tab switch creates a route without pushedByRoute
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');

    // Browser back (non-linear POP)
    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');

    // Browser forward
    cy.ionGoForward('/routing/tabs/settings');
    cy.ionPageVisible('settings-page');

    // Browser back again - without the fix, the forward stack is corrupted from
    // the previous misclassification, causing this back to be treated as forward.
    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');
    cy.get('ion-tab-button.tab-selected').contains('Home');

    // One more forward/back cycle to verify stack integrity
    cy.ionGoForward('/routing/tabs/settings');
    cy.ionPageVisible('settings-page');
    cy.get('ion-tab-button.tab-selected').contains('Settings');

    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');
    cy.get('ion-tab-button.tab-selected').contains('Home');
  });

  it('Home > D1 > Settings Tab > Browser Back > Browser Forward, forward navigation should have correct routeDirection', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');

    // Navigate to Details 1
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');

    // Switch to Settings tab (route has no pushedByRoute)
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');

    // Browser back (non-linear POP)
    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');

    // Browser forward to Settings
    cy.ionGoForward('/routing/tabs/settings');
    cy.ionPageVisible('settings-page');

    // Browser back to D1
    cy.ionGoBack('/routing/tabs/home/details/1');
    cy.ionPageVisible('home-details-page-1');

    // Browser back to Home. The D1 route lost its pushedByRoute when it was
    // recreated via a non-linear POP, so this back also goes through the
    // non-linear else branch.
    cy.ionGoBack('/routing/tabs/home');
    cy.ionPageVisible('home-page');
    cy.contains('[data-pageid=home-page]', '"routeAction":"pop"');
    cy.contains('[data-pageid=home-page]', '"pathname":"/routing/tabs/home"');
  });
});
