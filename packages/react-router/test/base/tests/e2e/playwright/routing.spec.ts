import { test, expect } from '@playwright/test';
import {
  ionPageVisible, ionPageHidden, ionPageDoesNotExist,
  ionNav, ionBackClick, ionTabClick, ionMenuClick, ionMenuNav,
  ionGoBack, ionGoForward, withTestingMode
} from './utils/test-utils';

test.describe('Routing Tests', () => {

  test('/ > Details 1, the details screen should appear', async ({ page }) => {
    await page.goto(withTestingMode('/routing'));
    await ionPageVisible(page, 'home-page');
    await ionNav(page, 'ion-item', 'Details 1');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="details-label"]')).toContainText('Details 1');
  });

  test('/ > Details 1 > Back, should go back to home', async ({ page }) => {
    await page.goto(withTestingMode('/routing'));
    await ionNav(page, 'ion-item', 'Details 1');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="details-label"]')).toContainText('Details 1');
    await ionBackClick(page, 'home-details-page-1');
    await expect(page.locator('[data-pageid="home-page"] ion-title')).toContainText('Home');
  });

  test('/ > Details 1 > Settings Tab > Home Tab, should go back to details 1 on home tab', async ({ page }) => {
    await page.goto(withTestingMode('/routing'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-details-page-1');
  });

  test('/ > Details 1 > Settings Tab > Home Tab > Home Tab, should go back to home', async ({ page }) => {
    await page.goto(withTestingMode('/routing'));
    await ionNav(page, 'ion-item', 'Details 1');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="details-label"]')).toContainText('Details 1');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-details-page-1');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-page');
  });

  test('When going directly to /tabs, it should load home page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs'));
    await ionPageVisible(page, 'home-page');
  });

  test('When going directly to /tabs/home, it should load home page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home'));
    await ionPageVisible(page, 'home-page');
  });

  test('When going directly to /tabs/settings, it should load settings page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/settings'));
    await ionPageVisible(page, 'settings-page');
  });

  test('Home Details 1 > Settings Tab > Home Tab, details 1 page should still be active', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home/details/1'));
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-details-page-1');
  });

  test('/ > Home Details 1+2+3 > Settings Tab > Setting Details 1+2+3 > Home Tab > Back * 3 > Settings Tab > Back * 3, should be at settings page', async ({ page }) => {
    // This was a bug when loading the root of the app and not going directly to the home tab
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await expect(page.locator('[data-pageid="home-details-page-3"] [data-testid="details-label"]')).toContainText('Details 3');
    await ionTabClick(page, 'Settings');
    await ionNav(page, 'ion-item', 'Settings Details 1');
    await ionNav(page, 'ion-button', 'Go to Settings Details 2');
    await ionNav(page, 'ion-button', 'Go to Settings Details 3');
    await expect(page.locator('[data-pageid="settings-details-page-3"] [data-testid="details-label"]')).toContainText('Details 3');
    await ionTabClick(page, 'Home');
    await expect(page.locator('[data-pageid="home-details-page-3"] [data-testid="details-label"]')).toContainText('Details 3');
    await ionBackClick(page, 'home-details-page-3');
    await expect(page.locator('[data-pageid="home-details-page-2"] [data-testid="details-label"]')).toContainText('Details 2');
    await ionBackClick(page, 'home-details-page-2');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="details-label"]')).toContainText('Details 1');
    await ionBackClick(page, 'home-details-page-1');
    await ionPageVisible(page, 'home-page');
  });

  test('/ > Details 1 with Query Param > Details 2 > Back, Query param should show on screen', async ({ page }) => {
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1 with Query Params');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="query-label"]')).toContainText('Query Params:');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await expect(page.locator('[data-pageid="home-details-page-2"] [data-testid="details-label"]')).toContainText('Details 2');
    await ionBackClick(page, 'home-details-page-2');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="query-label"]')).toContainText('Query Params:');
  });

  test('/ > Details 1 with Query Param > Settings Tab > Home Tab > Query param should show on screen', async ({ page }) => {
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1 with Query Params');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="query-label"]')).toContainText('Query Params:');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await expect(page.locator('[data-pageid="home-details-page-1"] [data-testid="query-label"]')).toContainText('Query Params:');
  });

  test('Home Details 1 > Home Tab > Details 1 > Home Tab, should be on home page', async ({ page }) => {
    // Tests a bug when landing directly on a page thats not the originalHref and going back to home
    await page.goto(withTestingMode('/routing/tabs/home/details/1'));
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-page');
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-page');
  });

  test('Home > Session Details Link > Session Details 2 > Back > Back, should be at home page', async ({ page }) => {
    // Tests a bug when landing directly on a page thats not the originalHref and going back to home
    await page.goto(withTestingMode('/routing/tabs/home'));
    await ionNav(page, 'a', 'Go to details 1 on settings');
    await ionPageVisible(page, 'settings-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Settings Details 2');
    await ionPageVisible(page, 'settings-details-page-2');
    await ionBackClick(page, 'settings-details-page-2');
    await ionPageVisible(page, 'settings-details-page-1');
    await ionBackClick(page, 'settings-details-page-1');
    await ionPageVisible(page, 'home-page');
  });

  test('Tab 3 > Other Page > Back, should be back on Tab 3', async ({ page }) => {
    // Tests transferring from one outlet to another and back again with animation
    await page.goto(withTestingMode('/routing/tabs/tab3'));
    await ionNav(page, 'ion-button', 'Go to Other Page');
    await ionPageVisible(page, 'other-page');
    await ionBackClick(page, 'other-page');
    await ionPageVisible(page, 'tab3-page');
  });

  // SKIPPED: Two MutationObserver tests for #25477 flash tests are in transition-flash.spec.ts

  test('/ > Menu > Favorites > Menu > Tabs, should be back on Home', async ({ page }) => {
    // Tests transferring from one outlet to another and back again via menu
    await page.goto(withTestingMode('/routing'));
    await ionPageVisible(page, 'home-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Favorites');
    await ionPageVisible(page, 'favorites-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Tabs');
    await ionPageVisible(page, 'home-page');
  });

  test('/ > Session Details > Details 2 > Details 3 > Browser Back * 3, should be back on home', async ({ page }) => {
    // Tests browser back button
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-2');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-1');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-page');
  });

  test('/ > Details 1 > Details 2 > Details 3 > Settings Tab > Home Tab > Browser Back, should be back on home', async ({ page }) => {
    // Tests browser back button with a tab switch
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-details-page-3');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-2');
    await expect(page.locator('ion-tab-button.tab-selected')).toContainText('Home');
  });

  test('/ > Details 1 > Details 2 > Details 3 > Browser Back > Back > Back, should be back on home', async ({ page }) => {
    // Tests browser back button with a tab switch
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-2');
    await ionBackClick(page, 'home-details-page-2');
    await ionPageVisible(page, 'home-details-page-1');
    await ionBackClick(page, 'home-details-page-1');
    await ionPageVisible(page, 'home-page');
  });

  test('/ > Details 1 > Details 2 > Details 3 > Browser Back > Browser Forward, should be back on Details 3', async ({ page }) => {
    // Tests browser forward button within a tab's own navigation stack
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-2');
    await ionGoForward(page);
    await ionPageVisible(page, 'home-details-page-3');
  });

  test('/ > Details 1 > Settings Details 1 > Browser Back > Browser Forward, should show Settings Details 1', async ({ page }) => {
    // Tests browser forward button across tabs (cross-tab forward)
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Settings Details 1');
    await ionPageVisible(page, 'settings-details-page-1');
    await ionGoBack(page);
    await ionPageVisible(page, 'home-details-page-1');
    await ionGoForward(page);
    await ionPageVisible(page, 'settings-details-page-1');
  });

  test('when props get passed into a route render, the component should update', async ({ page }) => {
    await page.goto(withTestingMode('/routing/propstest'));
    await ionPageVisible(page, 'props-test');
    await expect(page.locator('div[data-testid=count-label]')).toContainText('1');
    await page.locator('text=Increment').click();
    await expect(page.locator('div[data-testid=count-label]')).toContainText('2');
    await page.locator('text=Increment').click();
    await expect(page.locator('div[data-testid=count-label]')).toContainText('3');
  });

  test('/routing/asdf, when accessing a route not defined from root outlet, should show not found page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/asdf'));
    await ionPageVisible(page, 'not-found');
    await expect(page.getByText('Not found')).toBeVisible();
  });

  test('/tabs/home > Details 1 on settings > Home Tab, should be back on home page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home'));
    await ionNav(page, 'ion-item', 'Details 1 on settings');
    await ionPageVisible(page, 'settings-details-page-1');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-page');
  });

  test('/ > Details 1 on settings > Back > Settings Tab, should be on setting home', async ({ page }) => {
    // For bug https://github.com/ionic-team/ionic-framework/issues/21031
    await page.goto(withTestingMode('/routing/'));
    await ionNav(page, 'ion-item', 'Details 1 on settings');
    await ionPageVisible(page, 'settings-details-page-1');
    await ionBackClick(page, 'settings-details-page-1');
    await ionPageVisible(page, 'home-page');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
  });

  test('/routing/tabs/redirect > Should be on settings page > Home Tab > Should be on home page', async ({ page }) => {
    // tests that a redirect going to a tab other than the first tab works
    // fixes bug https://github.com/ionic-team/ionic-framework/issues/21830
    await page.goto(withTestingMode('/routing/tabs/redirect'));
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-page');
  });

  test('/routing/ > Details 1 > Details 2 > Details 3 > Back > Settings Tab > Home Tab > Should be at details 2 page', async ({ page }) => {
    // fixes an issue where route history was being lost after starting to go back, switching tabs
    // and switching back to the same tab again
    // for bug https://github.com/ionic-team/ionic-framework/issues/21834
    await page.goto(withTestingMode('/routing'));
    await ionPageVisible(page, 'home-page');
    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageVisible(page, 'home-details-page-1');
    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');
    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');
    await ionBackClick(page, 'home-details-page-3');
    await ionPageVisible(page, 'home-details-page-2');
    await ionTabClick(page, 'Settings');
    await ionPageVisible(page, 'settings-page');
    await ionTabClick(page, 'Home');
    await ionPageVisible(page, 'home-details-page-2');
  });

  test('/routing/tabs/home Menu > Favorites > Menu > Home with redirect, Home page should be visible, and Favorites should be destroyed', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home'));
    await ionPageVisible(page, 'home-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Favorites');
    await ionPageVisible(page, 'favorites-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Home with redirect');
    await ionPageVisible(page, 'home-page');
    await ionPageDoesNotExist(page, 'favorites-page');
  });

  test('/routing/tabs/home Menu > Favorites > Menu > Home with router, Home page should be visible, and Favorites should be destroyed', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home'));
    await ionPageVisible(page, 'home-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Favorites');
    await ionPageVisible(page, 'favorites-page');
    await ionMenuClick(page);
    await ionMenuNav(page, 'Home with router');
    await ionPageVisible(page, 'home-page');
    await ionPageDoesNotExist(page, 'favorites-page');
  });

  test('should show back button when going back to a pushed page', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home'));

    await ionNav(page, 'ion-item', 'Details 1');
    await ionPageHidden(page, 'home-page');
    await ionPageVisible(page, 'home-details-page-1');

    await page.locator('ion-tab-button#tab-button-settings').click();
    await ionPageHidden(page, 'home-details-page-1');
    await ionPageVisible(page, 'settings-page');

    await page.locator('ion-tab-button#tab-button-home').click();
    await ionPageHidden(page, 'settings-page');
    await ionPageVisible(page, 'home-details-page-1');

    await ionBackClick(page, 'home-details-page-1');

    await ionPageDoesNotExist(page, 'home-details-page-1');
    await ionPageVisible(page, 'home-page');
  });

  test('should mount new view item instances of parameterized routes', async ({ page }) => {
    await page.goto(withTestingMode('/routing/tabs/home/details/1'));

    const page1Input = page.locator('div.ion-page[data-pageid=home-details-page-1] [data-testid="details-input"]');
    await expect(page1Input).toHaveValue('');

    await page1Input.fill('1');

    await ionNav(page, 'ion-button', 'Go to Details 2');
    await ionPageVisible(page, 'home-details-page-2');

    const page2Input = page.locator('div.ion-page[data-pageid=home-details-page-2] [data-testid="details-input"]');
    await expect(page2Input).toHaveValue('');

    await page2Input.fill('2');

    await ionNav(page, 'ion-button', 'Go to Details 3');
    await ionPageVisible(page, 'home-details-page-3');

    const page3Input = page.locator('div.ion-page[data-pageid=home-details-page-3] [data-testid="details-input"]');
    await expect(page3Input).toHaveValue('');

    await page3Input.fill('3');

    await ionBackClick(page, 'home-details-page-3');
    await ionPageVisible(page, 'home-details-page-2');

    await expect(page2Input).toHaveValue('2');

    await ionBackClick(page, 'home-details-page-2');
    await ionPageVisible(page, 'home-details-page-1');

    await expect(page1Input).toHaveValue('1');
  });

  test('should complete chained Navigate redirects from root to /routing/tabs/home', async ({ page }) => {
    // Tests that chained Navigate redirects work correctly:
    // / > click Routing link > /routing (Navigate to tabs) > /routing/tabs (Navigate to home) > /routing/tabs/home
    // This was a bug where the second Navigate would be unmounted before it could trigger
    await page.goto(withTestingMode('/'));
    await ionNav(page, 'ion-item', 'Routing');
    await ionPageVisible(page, 'home-page');
    await expect(page).toHaveURL(/\/routing\/tabs\/home/);
  });

});
