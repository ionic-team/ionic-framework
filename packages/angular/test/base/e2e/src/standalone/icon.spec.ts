import { test, expect } from '@playwright/test';

test.describe('Icons', () => {
  test('should render an icon', async ({ page }) => {
    await page.goto('/standalone/icon');

    await expect(page.locator('ion-icon#icon-string').locator('svg')).toBeVisible();
    await expect(page.locator('ion-icon#icon-binding').locator('svg')).toBeVisible();
  });

  test('should render an icon on iOS mode', async ({ page }) => {
    await page.goto('/standalone/icon?ionic:mode=ios');

    await expect(page.locator('ion-icon#icon-mode').locator('svg')).toBeVisible();
  });

  test('should render an icon on MD mode', async ({ page }) => {
    await page.goto('/standalone/icon?ionic:mode=md');

    await expect(page.locator('ion-icon#icon-mode').locator('svg')).toBeVisible();
  });
});
