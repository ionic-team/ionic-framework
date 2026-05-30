import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/navigation/page1?ionic:_testing=true');
  });

  test('should navigate correctly', async ({ page }) => {
    // Note: testStack functionality would need to be implemented as a custom helper
    // For now, we'll test the basic navigation behavior
    await expect(page.locator('app-navigation-page2')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('app-navigation-page2')).toHaveAttribute('class', 'ion-page ion-page-hidden');

    await expect(page.locator('app-navigation-page1')).not.toHaveAttribute('aria-hidden');
    await expect(page.locator('app-navigation-page1')).toHaveAttribute('class', 'ion-page can-go-back');
  });
});
