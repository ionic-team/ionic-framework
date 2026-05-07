import { test, expect } from '@playwright/test';
import {
  ionPageVisible,
  ionPageHidden,
  ionPageDoesNotExist,
  ionBackClick,
  routerPush,
  routerReplace,
  ionRouterNavigate,
  tabClick,
  withTestingMode,
} from './utils/test-utils';

/**
 * Ports the unit tests in packages/vue-router/__tests__/locationHistory.spec.ts
 * to user-observable Playwright scenarios. Each describe block corresponds to
 * one Jest case so the mapping is auditable when removing the Jest suite.
 *
 * Animations are disabled via ionic:_testing=true so the tests are deterministic.
 */

test.describe('Location History', () => {
  // Maps to: 'should correctly add an item to location history'
  // Pushing the first entry must leave canGoBack=false (no back button).
  test('first navigation has no back button', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    const backBtn = page.locator('div.ion-page[data-pageid=home] ion-back-button');
    await expect(backBtn).toBeHidden();
  });

  // Maps to: 'should correctly replace an item to location history'
  // After replace, the previous entry is gone, so pressing back from the
  // replacement should NOT return to it.
  test('replace removes the previous entry from history', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/navigation');
    await ionPageVisible(page, 'navigation');

    await routerReplace(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageDoesNotExist(page, 'navigation');
  });

  // Maps to: 'should correctly pop an item from location history'
  // After popping (back button), the previous page is restored as current
  // and the popped page is removed from history.
  test('pop restores the previous page and removes the popped one', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await ionBackClick(page, 'routing');
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'routing');
  });

  // Maps to: 'should correctly wipe location history when routerDirection is root'
  // Navigate root replaces the entire stack: observably, the new page becomes
  // the only entry. After root-navigating to home (which has a back-button
  // with no default-href), the back button is hidden because canGoBack=false.
  // Pages with default-href always show their back button, so the assertion
  // only holds for pages without one. Home is our root page.
  test('routerDirection=root wipes prior history', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');

    await ionRouterNavigate(page, '/', 'root');
    await ionPageVisible(page, 'home');

    // canGoBack=false after a root nav. Home has no default-href, so its
    // back button must be hidden when there is no history to go back to.
    const backBtn = page.locator('div.ion-page[data-pageid=home] ion-back-button');
    await expect(backBtn).toBeHidden();
  });

  // Maps to: 'should correctly update a route'
  // The tab field on a RouteInfo is updated when the route entry already
  // exists. Observable via switching tabs and back: selected tab must update.
  test('tab info updates when revisiting a tab entry', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');
    await expect(page.locator('ion-tab-button#tab-button-tab1')).toHaveClass(/tab-selected/);

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');
    await expect(page.locator('ion-tab-button#tab-button-tab2')).toHaveClass(/tab-selected/);

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1');
    await expect(page.locator('ion-tab-button#tab-button-tab1')).toHaveClass(/tab-selected/);
  });

  // Maps to: 'should correctly get the first route for a tab'
  // Re-clicking the active tab returns to the tab root, regardless of how
  // deep we navigated within it. Exercises getFirstRouteInfoForTab().
  test('clicking active tab returns to that tab root', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');

    await page.locator('div.ion-page[data-pageid=tab1] #child-one').click();
    await ionPageVisible(page, 'tab1childone');

    await page.locator('div.ion-page[data-pageid=tab1childone] #child-two').click();
    await ionPageVisible(page, 'tab1childtwo');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1childtwo');
  });

  // Maps to: 'should correctly get the current route for a tab'
  // Switching to another tab and back should restore the deepest page in
  // the original tab. Exercises getCurrentRouteInfoForTab().
  test('switching tabs and back restores deepest page in source tab', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');

    await page.locator('div.ion-page[data-pageid=tab1] #child-one').click();
    await ionPageVisible(page, 'tab1childone');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');
    await ionPageHidden(page, 'tab1childone');

    await tabClick(page, 'tab1');
    await ionPageVisible(page, 'tab1childone');
  });

  // Maps to: 'should correctly get last route'
  // After a sequence of pushes the topmost page is the last one pushed.
  test('latest navigation is the visible page', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageHidden(page, 'routing');
  });

  // Maps to: 'should correctly determine if we can go back'
  // canGoBack drives ion-back-button visibility. Push to a non-root page
  // and the back button must appear; on root it must not.
  test('back button visibility tracks canGoBack', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    const homeBack = page.locator('div.ion-page[data-pageid=home] ion-back-button');
    await expect(homeBack).toBeHidden();

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    const routingBack = page.locator('div.ion-page[data-pageid=routing] ion-back-button');
    await expect(routingBack).toBeVisible();
  });

  // Maps to: 'should correctly find the last location'
  // findLastLocation walks the history backwards using pushedByRoute. Going
  // back through a deep stack must land on the correct sequence of pages
  // even when intermediate pages share routes/parameterized paths.
  test('back through deep stack restores intermediate pages in order', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await routerPush(page, '/routing/abc');
    await ionPageVisible(page, 'routingparameter-abc');

    await routerPush(page, '/routing/xyz');
    await ionPageVisible(page, 'routingparameter-xyz');

    await ionBackClick(page, 'routingparameter-xyz');
    await ionPageVisible(page, 'routingparameter-abc');
    await ionPageDoesNotExist(page, 'routingparameter-xyz');

    await ionBackClick(page, 'routingparameter-abc');
    await ionPageVisible(page, 'routing');
    await ionPageDoesNotExist(page, 'routingparameter-abc');

    await ionBackClick(page, 'routing');
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'routing');
  });
});
