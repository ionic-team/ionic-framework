import { test, expect } from '@playwright/test';

test.describe('Nested Outlet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/nested-outlet/page?ionic:_testing=true');
  });

  test('should navigate correctly', async ({ page }) => {
    await expect(page.locator('ion-router-outlet ion-router-outlet app-nested-outlet-page h1')).toHaveText('Nested page 1');

    await page.locator('#goto-tabs').click();

    await expect(page.locator('app-tabs')).toBeVisible();
    await expect(page.locator('app-tabs-tab1')).toBeVisible();

    await page.locator('#goto-nested-page1').click();

    await expect(page.locator('app-nested-outlet-page')).toBeVisible();
    await expect(page.locator('app-tabs')).not.toBeVisible();

    await page.locator('#goto-nested-page2').click();
    await expect(page.locator('app-nested-outlet-page2')).toBeVisible();

    await expect(page.locator('ion-router-outlet ion-router-outlet app-nested-outlet-page2 h1')).toHaveText('Nested page 2');

    await page.locator('#goto-nested-page1').click();
    await expect(page.locator('app-nested-outlet-page')).toBeVisible();

    await page.locator('#goto-nested-page2').click();
  });

  // Fixes https://github.com/ionic-team/ionic-framework/issues/28417
  test('parentOutlet should be defined', async ({ page }) => {
    await expect(page.locator('#parent-outlet span')).toHaveText('true');
  });
});
