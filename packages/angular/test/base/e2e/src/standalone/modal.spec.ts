import { test, expect } from '@playwright/test';

test.describe('Modals: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal');
  });

  test('should render modal', async ({ page }) => {
    await page.locator('button#open-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('ion-modal #modal-content')).toBeVisible();
  });
});
