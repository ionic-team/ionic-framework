import { test, expect } from '@playwright/test';

test.describe('View Child', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/view-child');
  });

  test('should get a reference to all children', async ({ page }) => {
    // button should be red
    await expect(page.locator('#color-button')).toHaveClass(/ion-color-danger/);

    // tabs should be found
    await expect(page.locator('#tabs-result')).toHaveText('all found');
  });
});
