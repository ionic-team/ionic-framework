import { test, expect } from '@playwright/test';
import {
  ionPageVisible,
  ionPageHidden,
  ionPageDoesNotExist,
  ionBackClick,
  routerPush,
  routerGo,
  tabClick,
  withTestingMode,
} from './utils/test-utils';

/**
 * Ports the unit tests in packages/vue-router/__tests__/viewStacks.spec.ts to
 * user-observable Playwright scenarios. The internal viewStacks API
 * (createViewItem, registerIonPage, findViewItemByRouteInfo, etc.) is not
 * directly observable, but its outcomes are: which pages are mounted,
 * visible, hidden, or removed at any given moment.
 *
 * Animations are disabled via ionic:_testing=true so the tests are deterministic.
 */

test.describe('View Stacks', () => {
  // Maps to: 'should create a view item' + 'should add a view item' + 'should register an ion page'
  // After navigating to a route, the view item is created, added to the
  // outlet's stack, and registered with its IonPage element. Observable:
  // the page is rendered with data-pageid and not marked invisible.
  test('navigated page is mounted, registered, and visible', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await expect(page.locator('div.ion-page[data-pageid=routing]')).toHaveCount(1);
  });

  // Maps to: 'should get view item by route info'
  // findViewItemByRouteInfo selects the right page when multiple pages are
  // mounted in the same outlet. Observable: the previous page becomes hidden
  // and the new page becomes visible after a push.
  test('correct view item is selected per route', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await ionPageVisible(page, 'home');

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await ionPageHidden(page, 'home');

    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageHidden(page, 'routing');
  });

  // Maps to: 'should get leaving view by route info'
  // findLeavingViewItemByRouteInfo identifies which page is leaving so the
  // outlet can apply the leave animation/hidden class. Observable: when
  // navigating from page A to page B, A becomes hidden (not removed).
  test('leaving view is hidden, not destroyed, on forward push', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageHidden(page, 'routing');
    // routing must still exist in the DOM (just hidden), so back nav can
    // restore it without re-mounting.
    await expect(page.locator('div.ion-page[data-pageid=routing]')).toHaveCount(1);
  });

  // Maps to: 'should get children to render'
  // getChildrenToRender returns only the mounted view items. Observable:
  // pages popped past are removed from the DOM; pages still in the stack
  // remain mounted (hidden).
  test('only mounted view items are present in the DOM', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');

    // Both the active page and its predecessors-in-stack stay mounted.
    await expect(page.locator('div.ion-page[data-pageid=home]')).toHaveCount(1);
    await expect(page.locator('div.ion-page[data-pageid=routing]')).toHaveCount(1);
    await expect(page.locator('div.ion-page[data-pageid=inputs]')).toHaveCount(1);

    // Popping inputs removes it from the DOM.
    await ionBackClick(page, 'inputs');
    await ionPageVisible(page, 'routing');
    await ionPageDoesNotExist(page, 'inputs');
  });

  // Maps to: 'should clear a stack'
  // viewStacks.clear(outletId) removes a stack when an outlet unmounts
  // (e.g., leaving a tabs context). Observable: leaving the tabs section
  // and re-entering creates a fresh stack, so old tab pages are gone.
  test('leaving a tabs context clears its view stack', async ({ page }) => {
    await page.goto(withTestingMode('/tabs/tab1'));
    await ionPageVisible(page, 'tab1');

    await tabClick(page, 'tab2');
    await ionPageVisible(page, 'tab2');

    await ionBackClick(page, 'tab2');
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'tabs');
    await ionPageDoesNotExist(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab2');

    // Re-enter tabs. Should mount fresh, with tab1 as the default.
    await routerPush(page, '/tabs/tab1');
    await ionPageVisible(page, 'tab1');
  });

  // Maps to: 'should unmount orphaned views'
  // unmountLeavingViews removes view items skipped over by a multi-step
  // backward navigation (e.g., router.go(-2)). Observable: the intermediate
  // pages must not be in the DOM after the multi-step back.
  test('router.go(-N) unmounts skipped views', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await routerPush(page, '/routing/abc');
    await ionPageVisible(page, 'routingparameter-abc');

    await routerGo(page, -2);
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'routing');
    await ionPageDoesNotExist(page, 'routingparameter-abc');
  });

  // Maps to: 'should remount intermediary views'
  // mountIntermediaryViews re-mounts pages skipped over by a multi-step
  // forward navigation. Observable: after going back N steps and forward N
  // steps, the intermediate pages exist again so we can step back through them.
  test('router.go(+N) remounts intermediary views', async ({ page }) => {
    await page.goto(withTestingMode('/'));
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await routerPush(page, '/routing/abc');
    await ionPageVisible(page, 'routingparameter-abc');

    await routerGo(page, -2);
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'routingparameter-abc');

    await routerGo(page, 2);
    await ionPageVisible(page, 'routingparameter-abc');

    // Stepping back one at a time must hit the intermediate /routing page.
    await routerGo(page, -1);
    await ionPageVisible(page, 'routing');
    await ionPageDoesNotExist(page, 'routingparameter-abc');
  });
});
