import type { Page } from '@playwright/test';
import { test, expect, withAnimations } from './utils/test-base';
import { waitForAnimationsComplete } from './utils/animation-utils';
import { ionBackClick, ionPageHidden, ionPageVisible, ionSwipeToGoBack, tabClick } from './utils/test-utils';

const getLifecycleEvents = async (page: Page, pageName?: string): Promise<string[]> => {
  const events: string[] = await page.evaluate(() => (window as any).lifecycleEvents ?? []);
  return pageName ? events.filter((event) => event.startsWith(`${pageName}:`)) : events;
};

const clearLifecycleEvents = (page: Page) => page.evaluate(() => ((window as any).lifecycleEvents = []));

/**
 * Drags far enough from the left edge to start the swipe back gesture, then
 * returns to the edge before releasing so the gesture is cancelled.
 * Calling `ionSwipeToGoBack(page, false)` won't work because it doesn't move far enough to start it.
 */
const cancelledSwipeBack = async (page: Page) => {
  const box = (await page.locator('ion-router-outlet').first().boundingBox())!;
  const y = box.y + box.height / 2;

  await page.mouse.move(box.x + 2, y);
  await page.mouse.down();
  for (const x of [10, 20, 40, 60, 80, 100, 60, 30, 10, 2]) {
    await page.mouse.move(box.x + x, y);
    await page.waitForTimeout(25);
  }
  await page.mouse.up();
};

/**
 * Verifies that the active tab's page, and a page in an outlet nested inside
 * it, get leave events when navigating out of the tabs, get enter events when
 * coming back, and never get leave events twice.
 */
test.describe('Tabs: active tab lifecycle when leaving and returning to the tabs', () => {
  test('should fire ionViewWillLeave and ionViewDidLeave on the active tab page', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'issue', description: 'FW-7148' });

    await page.goto('/tab-lifecycle/home');
    await ionPageVisible(page, 'tab-lifecycle-home');
    await expect.poll(() => getLifecycleEvents(page)).toEqual(['home:ionViewWillEnter', 'home:ionViewDidEnter']);
    await clearLifecycleEvents(page);

    await page.locator('#go-outside-home').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    await expect.poll(() => getLifecycleEvents(page)).toEqual(['home:ionViewWillLeave', 'home:ionViewDidLeave']);
  });

  test('should fire leave events on the active tab page each time the tabs are left', async ({ page }) => {
    await page.goto('/tab-lifecycle/home');
    await ionPageVisible(page, 'tab-lifecycle-home');

    await page.locator('#go-outside-home').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');
    await expect.poll(() => getLifecycleEvents(page)).toContain('home:ionViewDidLeave');
    await clearLifecycleEvents(page);

    await ionBackClick(page, 'tab-lifecycle-outside');
    await ionPageVisible(page, 'tab-lifecycle-home');
    await expect.poll(() => getLifecycleEvents(page)).toEqual(['home:ionViewWillEnter', 'home:ionViewDidEnter']);
    await clearLifecycleEvents(page);

    await page.locator('#go-outside-home').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    await expect.poll(() => getLifecycleEvents(page)).toEqual(['home:ionViewWillLeave', 'home:ionViewDidLeave']);
  });

  test('should not fire leave events on a previously visited tab that is hidden', async ({ page }) => {
    await page.goto('/tab-lifecycle/home');
    await ionPageVisible(page, 'tab-lifecycle-home');

    await tabClick(page, 'settings');
    await ionPageVisible(page, 'tab-lifecycle-settings');
    await expect
      .poll(() => getLifecycleEvents(page, 'settings'))
      .toEqual(['settings:ionViewWillEnter', 'settings:ionViewDidEnter']);
    await clearLifecycleEvents(page);

    await page.locator('#go-outside-settings').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    await expect
      .poll(() => getLifecycleEvents(page))
      .toEqual(['settings:ionViewWillLeave', 'settings:ionViewDidLeave']);
  });

  test('should fire ionViewWillEnter and ionViewDidEnter on the active tab page when going back to the tabs', async ({
    page,
  }) => {
    await page.goto('/tab-lifecycle/home');
    await ionPageVisible(page, 'tab-lifecycle-home');

    await page.locator('#go-outside-home').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');
    await expect.poll(() => getLifecycleEvents(page)).toContain('home:ionViewDidLeave');
    await clearLifecycleEvents(page);

    await ionBackClick(page, 'tab-lifecycle-outside');
    await ionPageVisible(page, 'tab-lifecycle-home');

    await expect.poll(() => getLifecycleEvents(page)).toEqual(['home:ionViewWillEnter', 'home:ionViewDidEnter']);
  });

  test('should not fire leave events again on the tab that was left when returning to a different tab', async ({
    page,
  }) => {
    await page.goto('/tab-lifecycle/home');
    await ionPageVisible(page, 'tab-lifecycle-home');

    await page.locator('#go-outside-home').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');
    await expect.poll(() => getLifecycleEvents(page)).toContain('home:ionViewDidLeave');
    await clearLifecycleEvents(page);

    await page.locator('#go-to-settings').click();
    await ionPageVisible(page, 'tab-lifecycle-settings');
    await expect
      .poll(() => getLifecycleEvents(page, 'settings'))
      .toEqual(['settings:ionViewWillEnter', 'settings:ionViewDidEnter']);

    expect(await getLifecycleEvents(page, 'home')).toEqual([]);
  });

  test('should fire ionViewWillLeave and ionViewDidLeave on a page in an outlet nested inside the active tab', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({ type: 'issue', description: 'FW-7148' });

    await page.goto('/tab-lifecycle/nested');
    await ionPageVisible(page, 'tab-lifecycle-inner');
    await expect.poll(() => getLifecycleEvents(page)).toContain('inner:ionViewDidEnter');
    await clearLifecycleEvents(page);

    await page.locator('#go-outside-inner').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');

    await expect.poll(() => getLifecycleEvents(page)).toEqual(['inner:ionViewWillLeave', 'inner:ionViewDidLeave']);
  });

  test('should fire ionViewWillEnter and ionViewDidEnter on a page in a nested outlet when going back to the tabs', async ({
    page,
  }) => {
    await page.goto('/tab-lifecycle/nested');
    await ionPageVisible(page, 'tab-lifecycle-inner');

    await page.locator('#go-outside-inner').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');
    await expect.poll(() => getLifecycleEvents(page)).toContain('inner:ionViewDidLeave');
    await clearLifecycleEvents(page);

    await ionBackClick(page, 'tab-lifecycle-outside');
    await ionPageVisible(page, 'tab-lifecycle-inner');

    await expect
      .poll(() => getLifecycleEvents(page, 'inner'))
      .toEqual(['inner:ionViewWillEnter', 'inner:ionViewDidEnter']);
  });

  test('should not fire leave events again on a page in a nested outlet when returning to a different tab', async ({
    page,
  }) => {
    await page.goto('/tab-lifecycle/nested');
    await ionPageVisible(page, 'tab-lifecycle-inner');

    await page.locator('#go-outside-inner').click();
    await ionPageVisible(page, 'tab-lifecycle-outside');
    await expect.poll(() => getLifecycleEvents(page)).toContain('inner:ionViewDidLeave');
    await clearLifecycleEvents(page);

    await page.locator('#go-to-settings').click();
    await ionPageVisible(page, 'tab-lifecycle-settings');
    await expect
      .poll(() => getLifecycleEvents(page, 'settings'))
      .toEqual(['settings:ionViewWillEnter', 'settings:ionViewDidEnter']);

    expect(await getLifecycleEvents(page, 'inner')).toEqual([]);
  });

  test('should fire leave and enter events on a page in a nested outlet when switching tabs', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({ type: 'issue', description: 'FW-7148' });

    await page.goto('/tab-lifecycle/nested');
    await ionPageVisible(page, 'tab-lifecycle-inner');
    await expect.poll(() => getLifecycleEvents(page)).toContain('inner:ionViewDidEnter');
    await clearLifecycleEvents(page);

    await tabClick(page, 'settings');
    await ionPageVisible(page, 'tab-lifecycle-settings');
    await expect
      .poll(() => getLifecycleEvents(page, 'inner'))
      .toEqual(['inner:ionViewWillLeave', 'inner:ionViewDidLeave']);
    await clearLifecycleEvents(page);

    await tabClick(page, 'nested');
    await ionPageVisible(page, 'tab-lifecycle-inner');
    await expect
      .poll(() => getLifecycleEvents(page, 'inner'))
      .toEqual(['inner:ionViewWillEnter', 'inner:ionViewDidEnter']);
  });

  test('should fire ionViewWillLeave and ionViewDidLeave once on the active tab page when a swipe back from the tabs completes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(withAnimations('/?ionic:mode=ios'));
    await ionPageVisible(page, 'home');

    await page.locator('ion-item#tab-lifecycle').click();
    await ionPageVisible(page, 'tab-lifecycle-home');
    await ionPageHidden(page, 'home');
    await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="tab-lifecycle"]');
    await expect.poll(() => getLifecycleEvents(page)).toContain('home:ionViewDidEnter');
    await clearLifecycleEvents(page);

    await ionSwipeToGoBack(page, true);
    await ionPageVisible(page, 'home');
    await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="home"]');

    await expect
      .poll(() => getLifecycleEvents(page, 'home'))
      .toEqual(['home:ionViewWillLeave', 'home:ionViewDidLeave']);
  });

  test('should fire ionViewWillLeave on the active tab page when a swipe back from the tabs is cancelled', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(withAnimations('/?ionic:mode=ios'));
    await ionPageVisible(page, 'home');

    await page.locator('ion-item#tab-lifecycle').click();
    await ionPageVisible(page, 'tab-lifecycle-home');
    await ionPageHidden(page, 'home');
    await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="tab-lifecycle"]');
    await expect.poll(() => getLifecycleEvents(page)).toContain('home:ionViewDidEnter');
    await clearLifecycleEvents(page);

    await cancelledSwipeBack(page);
    await ionPageVisible(page, 'tab-lifecycle-home');
    await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="tab-lifecycle"]');

    expect(await getLifecycleEvents(page, 'home')).toEqual(['home:ionViewWillLeave']);
  });
});
