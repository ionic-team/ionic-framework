import { test, expect } from '@playwright/test';
import { withTestingMode } from './utils/test-utils';

test.describe('Overlays', () => {
  test('should remove the overlay when going back to the previous route', async ({ page }) => {
    // Requires navigation history to perform a pop
    await page.goto(withTestingMode('/'));
    await page.goto(withTestingMode('/overlays'));

    await page.locator('#openModal').click();

    await expect(page.locator('ion-modal')).toBeAttached();

    await page.locator('#goBack').click();

    await expect(page.locator('ion-modal')).not.toBeAttached();
  });

  test('should remove the overlay when pushing to a new route', async ({ page }) => {
    await page.goto(withTestingMode('/overlays'));

    await page.locator('#openModal').click();

    await expect(page.locator('ion-modal')).toBeAttached();

    await page.locator('#push').click();

    await expect(page.locator('ion-modal')).not.toBeAttached();
  });

  test('should remove the overlay when replacing the route', async ({ page }) => {
    await page.goto(withTestingMode('/overlays'));

    await page.locator('#openModal').click();

    await expect(page.locator('ion-modal')).toBeAttached();

    await page.locator('#replace').click();

    await expect(page.locator('ion-modal')).not.toBeAttached();
  });
});
