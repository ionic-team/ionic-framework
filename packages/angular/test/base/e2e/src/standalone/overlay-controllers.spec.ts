import { test, expect } from '@playwright/test';

test.describe('Overlay Controllers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/overlay-controllers');
  });

  test('should present an alert', async ({ page }) => {
    await page.locator('button#open-alert').click();

    await expect(page.locator('ion-alert')).toBeVisible();
  });

  test('should present a loading indicator', async ({ page }) => {
    await page.locator('button#open-loading').click();

    await expect(page.locator('ion-loading')).toBeVisible();
  });

  test('should present a modal', async ({ page }) => {
    await page.locator('button#open-modal').click();

    await expect(page.locator('ion-modal app-dialog-content')).toBeVisible();
  });

  test('should present a picker', async ({ page }) => {
    await page.locator('button#open-picker').click();

    await expect(page.locator('ion-picker-legacy .picker-button')).toBeVisible();
  });

  test('should present a popover', async ({ page }) => {
    await page.locator('button#open-popover').click();

    await expect(page.locator('ion-popover app-dialog-content')).toBeVisible();
  });
});
