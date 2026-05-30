import { test, expect } from '@playwright/test';

test.describe('Router Outlet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/router-outlet');
  });

  test('should render a as a child page of the router outlet', async ({ page }) => {
    await expect(page.locator('ion-router-outlet app-router-outlet')).toBeVisible();
  });
});
