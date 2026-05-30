import { test, expect } from '@playwright/test';

test.describe('Routing with Standalone Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/standalone');
  });

  test('should render the component', async ({ page }) => {
    await expect(page.locator('ion-content')).toContainText('This is a standalone component rendered from a route.');
  });
});
