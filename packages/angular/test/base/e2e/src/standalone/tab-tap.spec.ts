import { test, expect, type Page } from '@playwright/test';

import { ionPageVisible } from '../../utils/test-utils';

const getScrollTop = (page: Page, selector: string) =>
  page.evaluate(async (selector) => {
    const content = document.querySelector(selector) as HTMLIonContentElement;
    return (await content.getScrollElement()).scrollTop;
  }, selector);

const scrollDown = async (page: Page, selector: string) => {
  await page.evaluate(
    (selector) => (document.querySelector(selector) as HTMLIonContentElement).scrollToPoint(0, 500),
    selector
  );
  await expect.poll(() => getScrollTop(page, selector)).toBe(500);
};

/**
 * Counts the calls to `ion-content`'s `scrollToTop` so that tests can verify
 * whether a scroll was requested, even if the scrolled page is removed afterwards.
 */
const trackScrollToTop = (page: Page) =>
  page.evaluate(() => {
    const win = window as any;
    const proto = customElements.get('ion-content')!.prototype;
    const scrollToTop = proto.scrollToTop;

    win.scrollToTopCalls = 0;
    proto.scrollToTop = function (...args: any[]) {
      win.scrollToTopCalls++;
      return scrollToTop.apply(this, args);
    };
  });

const getScrollToTopCalls = (page: Page) => page.evaluate(() => (window as any).scrollToTopCalls);

const enableTabTap = (page: Page) => page.evaluate(() => (window as any).Ionic.config.set('tabTap', true));

test.describe('Tabs: tabTap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/tab-tap/home');
    await ionPageVisible(page, 'app-tab-tap-home');
  });

  test('should scroll to the top when pressing the active tab button at the tab root', async ({ page }) => {
    await enableTabTap(page);
    await scrollDown(page, 'app-tab-tap-home ion-content');

    await page.locator('ion-tab-button[tab="home"]').click();

    await expect.poll(() => getScrollTop(page, 'app-tab-tap-home ion-content')).toBe(0);
  });

  test('should go back to the tab root without scrolling when pressing the active tab button on a child page', async ({
    page,
  }) => {
    await enableTabTap(page);
    await trackScrollToTop(page);
    await page.locator('#go-child').click();
    await ionPageVisible(page, 'app-tab-tap-child');

    await page.locator('ion-tab-button[tab="home"]').click();

    await ionPageVisible(page, 'app-tab-tap-home');
    await expect(page).toHaveURL(/\/standalone\/tab-tap\/home$/);
    expect(await getScrollToTopCalls(page)).toBe(0);
  });

  test('should not scroll when pressing a different tab button', async ({ page }) => {
    await enableTabTap(page);
    await scrollDown(page, 'app-tab-tap-home ion-content');

    await page.locator('ion-tab-button[tab="settings"]').click();
    await ionPageVisible(page, 'app-tab-tap-settings');
    await page.locator('ion-tab-button[tab="home"]').click();
    await ionPageVisible(page, 'app-tab-tap-home');

    expect(await getScrollTop(page, 'app-tab-tap-home ion-content')).toBe(500);
  });

  test('should not scroll when tabTap is not enabled', async ({ page }) => {
    await trackScrollToTop(page);
    await scrollDown(page, 'app-tab-tap-home ion-content');

    await page.locator('ion-tab-button[tab="home"]').click();

    // The page is already at the tab root, so there is no navigation to wait for
    await page.waitForTimeout(500);
    expect(await getScrollToTopCalls(page)).toBe(0);
    expect(await getScrollTop(page, 'app-tab-tap-home ion-content')).toBe(500);
  });
});
