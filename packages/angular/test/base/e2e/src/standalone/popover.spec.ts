import { test, expect } from '@playwright/test';

test.describe('Popovers: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/popover');
  });

  test('should render popover', async ({ page }) => {
    await page.locator('button#open-popover').click();

    await expect(page.locator('ion-popover')).toBeVisible();
    await expect(page.locator('ion-popover #popover-content')).toBeVisible();
  });
});
