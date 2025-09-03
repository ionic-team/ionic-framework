import { test, expect } from '@playwright/test';

test.describe('Bind Component Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/version-test/bind-route/test?query=test');
  });

  test('binding route data to inputs should work', async ({ page }) => {
    await expect(page.locator('#route-params')).toContainText('test');
    await expect(page.locator('#query-params')).toContainText('test');
    await expect(page.locator('#data')).toContainText('data:bindToComponentInputs');
    await expect(page.locator('#resolve')).toContainText('resolve:bindToComponentInputs');
  });
});
