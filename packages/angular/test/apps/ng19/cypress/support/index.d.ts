/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Swipe to go back on the current selector or router outlet
     * @example
     * ```
     * cy.ionSwipeToGoBack();
     * cy.ionSwipeToGoBack(true);
     * ```
     */
    ionSwipeToGoBack(complete: boolean, selector: string): Chainable<any>
    /**
     * Test that the proper pages are in the navigation stack
     * @example
     * ```
     * cy.testStack('ion-router-outlet', ['app-navigation-page2', 'app-navigation-page1']);
     * cy.testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
     * ```
     */
    testStack(selector: string, expected: string[]): Chainable<any>
    /**
     * Test whether or not the lifecycle events fired
     * @example
     * ```
     * cy.testLifeCycle('app-router-link-page', {
     *   ionViewWillEnter: 1,
     *   ionViewDidEnter: 1,
     *   ionViewWillLeave: 0,
     *   ionViewDidLeave: 0,
     * });
     * ```
     */
    testLifeCycle(selector: string, expected: any): Chainable<any>

    /**
     * Test whether or not an .ion-page element is visible.
     * Use this to test a page after navigating to it.
     * @example
     * ```
     * cy.ionPageVisible('app-my-page');
     * ```
     */
    ionPageVisible(selector: string): Chainable<any>

    /**
     * Test whether or not an .ion-page element is hidden
     * Use this to test a page after navigating away from it.
     * @example
     * ```
     * cy.ionPageHidden('app-my-page');
     * ```
     */
    ionPageHidden(selector: string): Chainable<any>

    /**
     * Test whether or not an .ion-page element exists.
     * Use this to test a page after popping it off the stack.
     * @example
     * ```
     * cy.ionPageDoesNotExist('app-my-page');
     * ```
     */
    ionPageDoesNotExist(selector: string): Chainable<any>

    /**
     * Clicks on a tab button with the given text.
     */
    ionTabClick(tabText: string): Chainable<any>;
  }
}


