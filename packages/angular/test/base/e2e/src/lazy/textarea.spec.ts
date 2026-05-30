import { test, expect } from '@playwright/test';

test.describe('Textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/textarea');
  });

  test('should become valid', async ({ page }) => {
    await expect(page.locator('#status')).toHaveText('INVALID');

    await page.locator('ion-textarea textarea').fill('hello');

    await expect(page.locator('#status')).toHaveText('VALID');
  });

  test('should update the form control value when typing', async ({ page }) => {
    await expect(page.locator('#value')).toContainText(`"textarea": ""`);
    await page.locator('ion-textarea textarea').fill('hello');

    await expect(page.locator('#value')).toContainText(`"textarea": "hello"`);
  });
});
