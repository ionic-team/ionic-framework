const port = 3000;

describe('Transition Unmount Guard', () => {
  /**
   * Tests that rapid navigation away from a tabs view during a non-animated
   * tab switch transition does not cause errors or stale state.
   *
   * The non-animated transition path in StackManager.transitionPage uses
   * waitForComponentsReady() (MutationObserver + 100ms timeout) followed by
   * nested requestAnimationFrame calls. If the component unmounts during this
   * async window, the unmount guard should cancel in-flight rAFs and disconnect
   * the MutationObserver to prevent DOM manipulation on detached elements.
   */

  it('should handle unmount during non-animated tab switch without errors', () => {
    // Navigate to tabs from home (pushes /tabs/tab1 onto history)
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');
    cy.get('#go-to-tabs').click();
    cy.ionPageVisible('tab1');

    // Start a tab switch (non-animated transition) and immediately go back to home.
    // History: /, /tabs/tab1, /tabs/tab2 — go(-2) jumps back to /
    // This unmounts the tabs StackManager while the tab switch transition is in flight.
    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.window().then((win) => win.history.go(-2));

    // Home page should be visible and functional after the rapid unmount
    cy.ionPageVisible('home');
  });

  it('should recover cleanly after unmount during transition and re-navigate to tabs', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');

    // First trip: navigate to tabs, switch tabs, immediately go back to home
    cy.get('#go-to-tabs').click();
    cy.ionPageVisible('tab1');
    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.window().then((win) => win.history.go(-2));
    cy.ionPageVisible('home');

    // Second trip: navigate to tabs again to verify no stale state
    cy.get('#go-to-tabs').click();
    cy.ionPageVisible('tab1');

    // Tab switching should still work correctly
    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.ionPageVisible('tab2');
    cy.ionPageHidden('tab1');

    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.ionPageVisible('tab1');
    cy.ionPageHidden('tab2');
  });

  it('should handle rapid repeated tab switches followed by unmount', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('home');
    cy.get('#go-to-tabs').click();
    cy.ionPageVisible('tab1');

    // Rapid tab switches to stack up multiple non-animated transitions
    cy.get('ion-tab-button#tab-button-tab2').click();
    cy.get('ion-tab-button#tab-button-tab1').click();
    cy.get('ion-tab-button#tab-button-tab2').click();

    // Navigate back to home while transitions may still be in flight.
    // Multiple tab switches pushed extra entries, so go back enough to reach /.
    cy.window().then((win) => win.history.go(-4));
    cy.ionPageVisible('home');

    // App should still be functional
    cy.get('#go-to-tabs').click();
    cy.ionPageVisible('tab1');
  });
});
