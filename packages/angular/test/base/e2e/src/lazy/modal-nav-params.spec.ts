import { test, expect } from '@playwright/test';

test.describe('Modal Nav Params', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/version-test/modal-nav-params');
  });

  test('should assign the rootParams when presented in a modal multiple times', async ({ page }) => {
    await page.locator('text=Open Modal').click();
    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('ion-modal')).toContainText('OK');

    await page.locator('text=Close').click();
    await expect(page.locator('ion-modal')).not.toBeVisible();

    await page.locator('text=Open Modal').click();
    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('ion-modal')).toContainText('OK');
  });
});
