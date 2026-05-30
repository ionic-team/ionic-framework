import { test, expect } from '@playwright/test';

test.describe('Overlays: Inline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/overlays-inline');
  });

  test.describe('Alert', () => {
    test('should be visible when presenting', async ({ page }) => {
      await expect(page.locator('ion-alert')).not.toBeVisible();

      await page.locator('#open-alert').click();
      await expect(page.locator('ion-alert')).toBeVisible();

      // Click the backdrop at a position that avoids the alert content
      await page.locator('ion-alert ion-backdrop').click({ position: { x: 10, y: 10 } });

      // Wait for dismissal animation to complete
      await page.waitForTimeout(500);

      await expect(page.locator('ion-alert')).not.toBeVisible();
    });
  });

  test.describe('Action Sheet', () => {
    test('should be visible when presenting', async ({ page }) => {
      await expect(page.locator('ion-action-sheet')).not.toBeVisible();

      await page.locator('#open-action-sheet').click();
      await expect(page.locator('ion-action-sheet')).toBeVisible();

      // Ensure backdrop dismissal works by clicking the backdrop
      await page.locator('ion-action-sheet ion-backdrop').click({ position: { x: 10, y: 10 } });

      // Wait for dismissal animation
      await page.waitForTimeout(500);

      await expect(page.locator('ion-action-sheet')).not.toBeVisible();
    });
  });

  test.describe('Loading', () => {
    test('should be visible when presenting', async ({ page }) => {
      await expect(page.locator('ion-loading')).not.toBeVisible();

      await page.locator('#open-loading').click();
      await expect(page.locator('ion-loading')).toBeVisible();

      // Ensure backdrop dismissal works by clicking the backdrop
      await page.locator('ion-loading ion-backdrop').click({ position: { x: 10, y: 10 } });

      // Wait for dismissal animation
      await page.waitForTimeout(500);

      await expect(page.locator('ion-loading')).not.toBeVisible();
    });
  });

  test.describe('Toast', () => {
    test('should be visible when presenting', async ({ page }) => {
      await expect(page.locator('ion-toast')).not.toBeVisible();

      await page.locator('#open-toast').click();
      await expect(page.locator('ion-toast .toast-wrapper')).toBeVisible();

      await page.locator('ion-toast .toast-button').click();
      await expect(page.locator('ion-toast')).not.toBeVisible();
    });
  });
});
