import { test, expect } from '@playwright/test';

test.describe('Router Outlet: query params', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/router-outlet-query-params');
  });

  test('should resolve relative links after navigating to the same page with query params', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/24587',
    });

    await page.locator('#set-query-params').click();
    await expect(page).toHaveURL(/\/standalone\/router-outlet-query-params\?foo=bar$/);

    await page.locator('#go-to-details').click();

    await expect(page).toHaveURL(/\/standalone\/router-outlet-query-params\/details$/);
    await expect(page.locator('app-router-outlet-query-params-details')).toBeVisible();
  });

  test('should update the route snapshot after navigating to the same page with query params', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/24587',
    });

    await page.locator('#set-query-params').click();
    await expect(page).toHaveURL(/\/standalone\/router-outlet-query-params\?foo=bar$/);

    await page.locator('#read-snapshot').click();

    await expect(page.locator('#snapshot-foo')).toHaveText('bar');
  });
});
