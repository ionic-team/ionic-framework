import { test, expect } from '@playwright/test';

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/inputs');
  });

  test.describe('basic functionality', () => {
    test('should reflect props when component has a default value', async ({ page }) => {
      // Disable inputs
      await page.locator('#disable-button').click();

      // Disabled prop
      await expect(page.locator('ion-input')).toHaveAttribute('disabled', '');
      await expect(page.locator('ion-input-otp')).toHaveAttribute('disabled', '');
      await expect(page.locator('ion-textarea')).toHaveAttribute('disabled', '');

      // Reset disabled state and set readonly state
      await page.locator('#disable-button').click();
      await page.locator('#readonly-button').click();

      // Readonly prop
      await expect(page.locator('ion-input')).toHaveAttribute('readonly', '');
      await expect(page.locator('ion-input-otp')).toHaveAttribute('readonly', '');
      await expect(page.locator('ion-textarea')).toHaveAttribute('readonly', '');
    });
  });
});
