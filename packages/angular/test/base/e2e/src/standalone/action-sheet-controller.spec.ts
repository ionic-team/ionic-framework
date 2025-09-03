import { test, expect } from '@playwright/test';

test.describe('Action Sheet Controller', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/action-sheet-controller');
  });

  test('should open an action sheet', async ({ page }) => {
    await page.locator('button#open-action-sheet').click();

    await expect(page.locator('ion-action-sheet')).toBeVisible();
  });
});
