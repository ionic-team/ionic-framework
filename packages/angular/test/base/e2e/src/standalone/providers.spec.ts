import { test, expect } from '@playwright/test';

test.describe('Providers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/providers');
  });

  test('provideIonicAngular should initialize Ionic and set config correctly', async ({ page }) => {
    await expect(page.locator('app-providers')).toBeVisible();

    await expect(page.locator('#keyboard-height')).toHaveText('12345');
  });
});
