import { test, expect } from '@playwright/test';

import { ionPageVisible } from '../utils/test-utils';

/**
 * The landing links have to be full page loads. See the comment in src/main.ts.
 */
test.describe('Landing Page', () => {
  test('should reach a rendered lazy app', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Go to Lazy App').click();
    await page.waitForURL('**/lazy');

    await ionPageVisible(page, 'app-home-page');
    await expect(page.locator('ion-title')).toContainText('Lazy');
  });

  test('should reach a rendered standalone app', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Go to Standalone App').click();
    await page.waitForURL('**/standalone');

    await ionPageVisible(page, 'app-home-page');
    await expect(page.locator('ion-title')).toContainText('Standalone');
  });

  // Back-navigating from the lazy app puts the lazy loader and the custom-elements
  // bundle on one page, which docs/angular/testing.md warns against. The landing has
  // no .ion-page of its own, so assert on the anchor, which ion-item only renders
  // once it has upgraded.
  test('should return to a rendered landing page', async ({ page }) => {
    await page.goto('/lazy');

    await page.locator('ion-back-button').click();
    await page.waitForURL(/\/$/);

    await expect(page.locator('ion-item[href="lazy"] a')).toHaveCount(1);
    await expect(page.locator('ion-item[href="lazy"]')).toContainText('Go to Lazy App');
  });

  test('should reach a rendered standalone app from the lazy bootstrap', async ({ page }) => {
    await page.goto('/lazy');
    await page.locator('ion-back-button').click();
    await page.waitForURL(/\/$/);

    // Wait for the upgrade before clicking: an un-upgraded ion-item renders no
    // anchor, so the click would land on nothing and time out at waitForURL.
    await expect(page.locator('ion-item[href="standalone"] a')).toHaveCount(1);

    await page.evaluate(() => ((window as any).__sameDocument = true));

    await page.getByText('Go to Standalone App').click();
    await page.waitForURL('**/standalone');

    // A routerLink would still render this route, just against the lazy
    // implementation, so the reload is what has to be asserted.
    expect(await page.evaluate(() => (window as any).__sameDocument)).toBeUndefined();
    await ionPageVisible(page, 'app-home-page');
    await expect(page.locator('ion-title')).toContainText('Standalone');
  });
});
