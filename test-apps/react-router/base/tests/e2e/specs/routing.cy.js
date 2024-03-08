const port = 3000;

describe('Routing Tests', () => {
  // before(() => {
  //   Cypress.config('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')
  // });

  it('/ > Details 1, the details screen should appear', () => {
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionPageVisible('home-page');
    cy.ionNav('ion-item', 'Details 1');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
  });

  it('/ > Details 1 > Back, should go back to home', () => {
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionNav('ion-item', 'Details 1');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
    cy.ionBackClick('home-details-page-1');
    cy.contains('[data-pageid=home-page] ion-title', 'Home');
  });

  it('/ > Details 1 > Settings Tab > Home Tab, should go back to details 1 on home tab', () => {
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-details-page-1');
  });

  it('/ > Details 1 > Settings Tab > Home Tab > Home Tab, should go back to home', () => {
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionNav('ion-item', 'Details 1');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-details-page-1');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
  });

  it('When going directly to /tabs, it should load home page', () => {
    cy.visit(`http://localhost:${port}/routing/tabs`);
    cy.ionPageVisible('home-page');
  });

  it('When going directly to /tabs/home, it should load home page', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionPageVisible('home-page');
  });

  it('When going directly to /tabs/settings, it should load settings page', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/settings`);
    cy.ionPageVisible('settings-page');
  });

  it('Home Details 1 > Settings Tab > Home Tab, details 1 page should still be active', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home/details/1`);
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-details-page-1');
  });

  it('/ > Home Details 1+2+3 > Settings Tab > Setting Details 1+2+3 > Home Tab > Back * 3 > Settings Tab > Back * 3, should be at settings page', () => {
    // This was a bug when loading the root of the app and not going directly to the home tab
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Settings');
    cy.ionNav('ion-item', 'Settings Details 1');
    cy.ionNav('ion-button', 'Go to Settings Details 2');
    cy.ionNav('ion-button', 'Go to Settings Details 3');
    cy.contains('[data-pageid=settings-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Home');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionBackClick('home-details-page-3');
    cy.contains('[data-pageid=home-details-page-2] ion-label', 'Details 2');
    cy.ionBackClick('home-details-page-2');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
    cy.ionBackClick('home-details-page-1');
    cy.ionPageVisible('home-page');
  });

  it('/ > Details 1 with Query Param > Details 2 > Back,  Query param should show on screen', () => {
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1 with Query Params');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Query Params: ');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.contains('[data-pageid=home-details-page-2] ion-label', 'Details 2');
    cy.ionBackClick('home-details-page-2');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Query Params: ');
  });

  it('/ > Details 1 with Query Param > Settings Tab > Home Tab > Query param should show on screen', () => {
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1 with Query Params');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Query Params: ');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Query Params: ');
  });

  it('Home Details 1 > Home Tab > Details 1 > Home Tab, should be on home page', () => {
    // Tests a bug when landing directly on a page thats not the originalHref and going back to home
    cy.visit(`http://localhost:${port}/routing/tabs/home/details/1`);
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
  });

  it('Home > Session Details Link > Session Details 2 > Back > Back, should be at home page', () => {
    // Tests a bug when landing directly on a page thats not the originalHref and going back to home
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionNav('a', 'Go to details 1 on settings');
    cy.ionPageVisible('settings-details-page-1');
    cy.ionNav('ion-button', 'Go to Settings Details 2');
    cy.ionPageVisible('settings-details-page-2');
    cy.ionBackClick('settings-details-page-2');
    cy.ionPageVisible('settings-details-page-1');
    cy.ionBackClick('settings-details-page-1');
    cy.ionPageVisible('home-page');
  });

  it('Tab 3 > Other Page > Back, should be back on Tab 3', () => {
    // Tests transferring from one outlet to another and back again with animation
    cy.visit(`http://localhost:${port}/routing/tabs/tab3`);
    cy.ionNav('ion-button', 'Go to Other Page');
    cy.ionPageVisible('other-page');
    cy.ionBackClick('other-page');
    cy.ionPageVisible('tab3-page');
  });

  it('/ > Menu > Favorites > Menu > Tabs, should be back on Home', () => {
    // Tests transferring from one outlet to another and back again via menu
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionMenuClick();
    cy.ionMenuNav('Favorites');
    cy.ionPageVisible('favorites-page');
    cy.ionMenuClick();
    cy.ionMenuNav('Tabs');
    cy.ionPageVisible('home-page');
  });

  it('/ > Session Details > Details 2 > Details 3 > Browser Back * 3, should be back on home', () => {
    // Tests browser back button
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionPageVisible('home-details-page-2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.ionPageVisible('home-details-page-3');
    cy.go('back');
    cy.ionPageVisible('home-details-page-2');
    cy.go('back');
    cy.ionPageVisible('home-details-page-1');
    cy.go('back');
    cy.ionPageVisible('home-page');
  });

  it('/ > Details 1 > Details 2 > Details 3 > Settings Tab > Home Tab > Browser Back, should be back on home', () => {
    // Tests browser back button with a tab switch
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionPageVisible('home-details-page-2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.ionPageVisible('home-details-page-3');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-details-page-3');
    cy.go('back');
    cy.ionPageVisible('home-details-page-2');
    cy.get('ion-tab-button.tab-selected').contains('Home');
  });

  it('/ > Details 1 > Details 2 > Details 3 > Browser Back > Back > Back, should be back on home', () => {
    // Tests browser back button with a tab switch
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionPageVisible('home-details-page-2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.ionPageVisible('home-details-page-3');
    cy.go('back');
    cy.ionPageVisible('home-details-page-2');
    cy.ionBackClick('home-details-page-2');
    cy.ionPageVisible('home-details-page-1');
    cy.ionBackClick('home-details-page-1');
    cy.ionPageVisible('home-page');
  });

  it('when props get passed into a route render, the component should update', () => {
    cy.visit(`http://localhost:${port}/routing/propstest`);
    cy.ionPageVisible('props-test');
    cy.get('div[data-testid=count-label]').contains('1');
    cy.contains('Increment').click();
    cy.get('div[data-testid=count-label]').contains('2');
    cy.contains('Increment').click();
    cy.get('div[data-testid=count-label]').contains('3');
  });

  it('/routing/asdf, when accessing a route not defined from root outlet, should show not found page', () => {
    cy.visit(`http://localhost:${port}/routing/asdf`, { failOnStatusCode: false });
    cy.ionPageVisible('not-found');
    cy.get('div').contains('Not found');
  });

  it('/tabs/home > Details 1 on settings > Home Tab, should be back on home page', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionNav('ion-item', 'Details 1 on settings');
    cy.ionPageVisible('settings-details-page-1');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
  });

  it('/ > Details 1 on settings > Back > Settings Tab, should be on setting home', () => {
    // For bug https://github.com/ionic-team/ionic/issues/21031
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1 on settings');
    cy.ionPageVisible('settings-details-page-1');
    cy.ionBackClick('settings-details-page-1');
    cy.ionPageVisible('home-page');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
  });

  it('/routing/tabs/redirect > Should be on settings page > Home Tab > Should be on home page', () => {
    // tests that a redirect going to a tab other than the first tab works
    // fixes bug https://github.com/ionic-team/ionic-framework/issues/21830
    cy.visit(`http://localhost:${port}/routing/tabs/redirect`);
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-page');
  });

  it('/routing/ > Details 1 > Details 2 > Details 3 > Back > Settings Tab > Home Tab > Should be at details 2 page', () => {
    // fixes an issue where route history was being lost after starting to go back, switching tabs
    // and switching back to the same tab again
    // for bug https://github.com/ionic-team/ionic-framework/issues/21834
    cy.visit(`http://localhost:${port}/routing`);
    cy.ionPageVisible('home-page');
    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageVisible('home-details-page-1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionPageVisible('home-details-page-2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.ionPageVisible('home-details-page-3');
    cy.ionBackClick('home-details-page-3');
    cy.ionPageVisible('home-details-page-2');
    cy.ionTabClick('Settings');
    cy.ionPageVisible('settings-page');
    cy.ionTabClick('Home');
    cy.ionPageVisible('home-details-page-2');
  });

  it('/routing/tabs/home Menu > Favorites > Menu > Home with redirect, Home page should be visible, and Favorites should be hidden', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionMenuClick();
    cy.ionMenuNav('Favorites');
    cy.ionPageVisible('favorites-page');
    cy.ionMenuClick();
    cy.ionMenuNav('Home with redirect');
    cy.ionPageVisible('home-page');
    cy.ionPageDoesNotExist('favorites-page');
  });

  it('/routing/tabs/home Menu > Favorites > Menu > Home with router, Home page should be visible, and Favorites should be hidden', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);
    cy.ionMenuClick();
    cy.ionMenuNav('Favorites');
    cy.ionPageVisible('favorites-page');
    cy.ionMenuClick();
    cy.ionMenuNav('Home with router');
    cy.ionPageVisible('home-page');
    cy.ionPageHidden('favorites-page');
  });

  it('should show back button when going back to a pushed page', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home`);

    cy.ionNav('ion-item', 'Details 1');
    cy.ionPageHidden('home-page');
    cy.ionPageVisible('home-details-page-1');

    cy.get('ion-tab-button#tab-button-settings').click();
    cy.ionPageHidden('home-details-page-1');
    cy.ionPageVisible('settings-page');

    cy.get('ion-tab-button#tab-button-home').click();
    cy.ionPageHidden('settings-page');
    cy.ionPageVisible('home-details-page-1');

    cy.ionBackClick('home-details-page-1');

    cy.ionPageDoesNotExist('home-details-page-1');
    cy.ionPageVisible('home-page');
  });

  it('should mount new view item instances of parameterized routes', () => {
    cy.visit(`http://localhost:${port}/routing/tabs/home/details/1`);

    cy.get('div.ion-page[data-pageid=home-details-page-1]')
      .get('[data-testid="details-input"]')
      .should('have.value', '');

    cy.get('div.ion-page[data-pageid=home-details-page-1] [data-testid="details-input"]').type('1');

    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionPageVisible('home-details-page-2');

    cy.get('div.ion-page[data-pageid=home-details-page-2] [data-testid="details-input"]').should('have.value', '');

    cy.get('div.ion-page[data-pageid=home-details-page-2] [data-testid="details-input"]').type('2');

    cy.ionNav('ion-button', 'Go to Details 3');
    cy.ionPageVisible('home-details-page-3');

    cy.get('div.ion-page[data-pageid=home-details-page-3] [data-testid="details-input"]').should('have.value', '');

    cy.get('div.ion-page[data-pageid=home-details-page-3] [data-testid="details-input"]').type('3');

    cy.ionBackClick('home-details-page-3');
    cy.ionPageVisible('home-details-page-2');

    cy.get('div.ion-page[data-pageid=home-details-page-2] [data-testid="details-input"]').should('have.value', '2');

    cy.ionBackClick('home-details-page-2');
    cy.ionPageVisible('home-details-page-1');

    cy.get('div.ion-page[data-pageid=home-details-page-1] [data-testid="details-input"]').should('have.value', '1');
  });

  /*
    Tests to add:
    Test that lifecycle events fire
    Test unmounting components by passing unmount to routerOptions
    Test components mount/unmount properly
  */
});
