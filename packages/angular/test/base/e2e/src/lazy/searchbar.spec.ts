import { test, expect } from '@playwright/test';

test.describe('Searchbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/searchbar');
  });

  test('should become valid', async ({ page }) => {
    await expect(page.locator('#status')).toHaveText('INVALID');

    await page.locator('ion-searchbar input').fill('hello');

    await expect(page.locator('#status')).toHaveText('VALID');
  });

  test('should update the form control value when typing', async ({ page }) => {
    await expect(page.locator('#value')).toContainText(`"searchbar": ""`);
    await page.locator('ion-searchbar input').fill('hello');

    await expect(page.locator('#value')).toContainText(`"searchbar": "hello"`);
  });
});
