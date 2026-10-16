import { test, expect, type Page } from '@playwright/test';

import { ionPageVisible } from '../../utils/test-utils';

const getOpacityScale = (page: Page) =>
  page.locator('ion-tab-bar').evaluate((el) => el.style.getPropertyValue('--opacity-scale'));

/**
 * The tab bar starts following a page once the page is visible, so wait for
 * the effect to be set up on the content before scrolling it.
 */
const scrollToBottom = async (page: Page, pageSelector: string) => {
  const content = page.locator(`${pageSelector} ion-content`);
  await expect(content).toHaveClass(/content-tab-bar-hide-scroll-partner/);
  await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
};

const scrollToTop = (page: Page, pageSelector: string) =>
  page.locator(`${pageSelector} ion-content`).evaluate((el: HTMLIonContentElement) => el.scrollToTop(0));

test.describe('Tab Bar: scrollEffect="hide"', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/tab-bar-scroll-effect/tab1');
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-tab1');
  });

  test('should hide the tab bar when scrolling down the first tab', async ({ page }) => {
    await scrollToBottom(page, 'app-tab-bar-scroll-effect-tab1');

    await expect(page.locator('ion-tab-bar')).toHaveClass(/tab-bar-scroll-hidden/);
  });

  test('should hide and show the tab bar when scrolling after switching tabs', async ({ page }) => {
    await page.locator('ion-tab-button[tab="tab2"]').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-tab2');

    await scrollToBottom(page, 'app-tab-bar-scroll-effect-tab2');
    await expect(page.locator('ion-tab-bar')).toHaveClass(/tab-bar-scroll-hidden/);

    await scrollToTop(page, 'app-tab-bar-scroll-effect-tab2');
    await expect(page.locator('ion-tab-bar')).not.toHaveClass(/tab-bar-scroll-hidden/);
  });

  test('should not hide the tab bar when scrolling down a child page of a tab', async ({ page }) => {
    await page.locator('#go-child').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-child');

    // The tab bar stopped following the first tab and does not follow the child page
    await expect(page.locator('app-tab-bar-scroll-effect-tab1 ion-content')).not.toHaveClass(
      /content-tab-bar-hide-scroll-partner/
    );
    await page
      .locator('app-tab-bar-scroll-effect-child ion-content')
      .evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

    await expect(page.locator('ion-tab-bar')).not.toHaveClass(/tab-bar-scroll-hidden/);
  });

  test('should show the tab bar when navigating to a child page and hide it again when going back', async ({
    page,
  }) => {
    await scrollToBottom(page, 'app-tab-bar-scroll-effect-tab1');
    await expect(page.locator('ion-tab-bar')).toHaveClass(/tab-bar-scroll-hidden/);

    await scrollToTop(page, 'app-tab-bar-scroll-effect-tab1');
    await page.locator('#go-child').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-child');
    await expect(page.locator('ion-tab-bar')).not.toHaveClass(/tab-bar-scroll-hidden/);

    await page.locator('app-tab-bar-scroll-effect-child ion-back-button').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-tab1');

    await scrollToBottom(page, 'app-tab-bar-scroll-effect-tab1');
    await expect(page.locator('ion-tab-bar')).toHaveClass(/tab-bar-scroll-hidden/);
  });

  test('should hide the tab bar on a child page when tabBarScrollEffect is true', async ({ page }) => {
    await page.locator('#go-child-effect').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-child');

    await scrollToBottom(page, 'app-tab-bar-scroll-effect-child');

    await expect(page.locator('ion-tab-bar')).toHaveClass(/tab-bar-scroll-hidden/);
  });
});

test.describe('Tab Bar: scrollEffect="fade"', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/tab-bar-scroll-effect/tab1?effect=fade');
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-tab1');
  });

  test('should fade the tab bar background out at the end of the content', async ({ page }) => {
    await expect.poll(() => getOpacityScale(page)).toBe('1');

    await page
      .locator('app-tab-bar-scroll-effect-tab1 ion-content')
      .evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

    await expect.poll(() => getOpacityScale(page)).toBe('0');
  });

  test('should follow the page that is visible after switching tabs', async ({ page }) => {
    await page
      .locator('app-tab-bar-scroll-effect-tab1 ion-content')
      .evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
    await expect.poll(() => getOpacityScale(page)).toBe('0');

    await page.locator('ion-tab-button[tab="tab2"]').click();
    await ionPageVisible(page, 'app-tab-bar-scroll-effect-tab2');
    await expect.poll(() => getOpacityScale(page)).toBe('1');

    await page
      .locator('app-tab-bar-scroll-effect-tab2 ion-content')
      .evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

    await expect.poll(() => getOpacityScale(page)).toBe('0');
  });
});
