import { test, expect } from '@playwright/test';

test.describe('Popovers: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/popover-inline');
  });

  test('should initially have no items', async ({ page }) => {
    await page.locator('ion-button').click();

    await expect(page.locator('ion-popover')).toBeVisible();
    await expect(page.locator('ion-list ion-item')).not.toBeVisible();
  });

  test('should have items after 1500ms', async ({ page }) => {
    await page.locator('ion-button').click();

    await expect(page.locator('ion-popover')).toBeVisible();

    await page.waitForTimeout(1500);

    await expect(page.locator('ion-list ion-item:nth-child(1)')).toHaveText('A');
    await expect(page.locator('ion-list ion-item:nth-child(2)')).toHaveText('B');
    await expect(page.locator('ion-list ion-item:nth-child(3)')).toHaveText('C');
    await expect(page.locator('ion-list ion-item:nth-child(4)')).toHaveText('D');
  });

  test('should have an item with a disabled attribute', async ({ page }) => {
    await page.locator('ion-button').click();

    await expect(page.locator('ion-popover')).toBeVisible();

    await page.waitForTimeout(1500);

    await expect(page.locator('ion-list ion-item:nth-child(3)')).toHaveAttribute('disabled');
  });
});
