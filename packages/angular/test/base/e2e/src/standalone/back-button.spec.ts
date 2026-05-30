import { test, expect } from '@playwright/test';

test.describe('Back Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/back-button');
  });

  test('should be visible and navigate back to page', async ({ page }) => {
    await expect(page.locator('app-back-button')).toBeVisible();

    await page.locator('ion-back-button').click();

    await expect(page.locator('app-back-button')).not.toBeVisible();
    await expect(page.locator('app-router-outlet')).toBeVisible();
  });
});
