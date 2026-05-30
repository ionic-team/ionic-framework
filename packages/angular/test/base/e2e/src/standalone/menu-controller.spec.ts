import { test, expect } from '@playwright/test';

test.describe('Menu Controller', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/menu-controller');
  });

  // https://github.com/ionic-team/ionic-framework/issues/28337
  test('should register menus correctly', async ({ page }) => {
    await page.locator('#set-menu-count').click();
    await expect(page.locator('#registered-menu-count')).toHaveText('1');
  });
});
