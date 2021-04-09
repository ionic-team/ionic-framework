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
  }
}


