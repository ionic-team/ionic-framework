import { test, expect } from '@playwright/test';

test.describe('Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/nav');
  });

  test('should mount the root component', async ({ page }) => {
    await expect(page.locator('app-nav')).toBeVisible();

    await expect(page.locator('text=Page One')).toBeVisible();
  });
});
