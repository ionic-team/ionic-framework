import { test, expect } from './utils/test-base';
import {
  ionPageVisible,
  ionPageHidden,
  ionPageDoesNotExist,
  ionBackClick,
  routerPush,
  routerGo,
  tabClick,
} from './utils/test-utils';

/**
 * User-observable scenarios for the internal viewStacks API. The API itself
 * is not directly observable, but its outcomes are: which pages are mounted,
 * visible, hidden, or removed at any given moment.
 *
 * Animations are disabled by default via the test-base fixture so the tests
 * are deterministic.
 */

test.describe('View Stacks', () => {
  // After navigating to a route, the page is rendered with data-pageid and
  // not marked invisible.
  test('navigated page is mounted, registered, and visible', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await expect(page.locator('div.ion-page[data-pageid=routing]')).toHaveCount(1);
  });

  // The previous page becomes hidden and the new page becomes visible after
  // a push, so the outlet must be selecting the right page per route.
  test('correct view item is selected per route', async ({ page }) => {
    await page.goto('/');
    await ionPageVisible(page, 'home');

    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');
    await ionPageHidden(page, 'home');

    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageHidden(page, 'routing');
  });

  // When navigating from page A to page B, A becomes hidden (not removed)
  // so back nav can restore it without re-mounting.
  test('leaving view is hidden, not destroyed, on forward push', async ({ page }) => {
    await page.goto('/');
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await routerPush(page, '/inputs');
    await ionPageVisible(page, 'inputs');
    await ionPageHidden(page, 'routing');
    // routing must still exist in the DOM (just hidden), so back nav can
    // restore it without re-mounting.
    await expect(page.locator('div.ion-page[data-pageid=routing]')).toHaveCount(1);
  });

  // Pages popped past are removed from the DOM; pages still in the stack
  // remain mounted (hidden).
  test('only mounted view items are present in the DOM', async ({ page }) => {
    await page.goto('/');
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

  // Leaving the tabs section and re-entering creates a fresh stack, so old
  // tab pages are gone.
  test('leaving a tabs context clears its view stack', async ({ page }) => {
    await page.goto('/tabs/tab1');
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

  // Pages skipped over by a multi-step backward navigation (e.g.,
  // router.go(-2)) must not remain in the DOM.
  test('router.go(-N) unmounts skipped views', async ({ page }) => {
    await page.goto('/');
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    await routerPush(page, '/routing/abc');
    await ionPageVisible(page, 'routingparameter-abc');

    await routerGo(page, -2);
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'routing');
    await ionPageDoesNotExist(page, 'routingparameter-abc');
  });

  // After going back N steps and forward N steps, the intermediate pages
  // exist again so we can step back through them.
  test('router.go(+N) remounts intermediary views', async ({ page }) => {
    await page.goto('/');
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
