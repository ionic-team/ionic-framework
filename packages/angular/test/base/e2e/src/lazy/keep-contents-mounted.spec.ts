import { test, expect } from '@playwright/test';

test.describe('Keep Contents Mounted', () => {
  test.describe('Modal', () => {
    test('should not mount component if false', async ({ page }) => {
      await page.goto('/lazy/modal-inline');

      await expect(page.locator('ion-modal ion-content')).not.toBeVisible();
    });

    test('should mount component if true', async ({ page }) => {
      await page.goto('/lazy/keep-contents-mounted');

      // Check that the content exists in the DOM (mounted) but is not visible
      await expect(page.locator('ion-modal ion-content')).toBeAttached();
      await expect(page.locator('ion-modal ion-content')).not.toBeVisible();
    });

    test('should keep component mounted after dismissing if true', async ({ page }) => {
      await page.goto('/lazy/keep-contents-mounted');

      await page.locator('#open-modal').click();

      await expect(page.locator('ion-modal ion-content')).toBeVisible();

      await page.locator('ion-modal ion-button').click();

      await expect(page.locator('ion-modal')).not.toBeVisible();
      await expect(page.locator('ion-modal')).toHaveClass(/overlay-hidden/);

      // Content should be mounted but not visible after dismissal
      await expect(page.locator('ion-modal ion-content')).toBeAttached();
      await expect(page.locator('ion-modal ion-content')).not.toBeVisible();
    });

    test('should have ion-delegate-host on mount', async ({ page }) => {
      await page.goto('/lazy/keep-contents-mounted');

      // Check that the delegate host exists in the DOM (mounted) but is not visible
      await expect(page.locator('ion-modal .ion-delegate-host')).toBeAttached();
      await expect(page.locator('ion-modal .ion-delegate-host')).not.toBeVisible();
    });
  });

  test.describe('Popover', () => {
    test('should not mount component if false', async ({ page }) => {
      await page.goto('/lazy/popover-inline');

      await expect(page.locator('ion-popover ion-content')).not.toBeVisible();
    });

    test('should mount component if true', async ({ page }) => {
      await page.goto('/lazy/keep-contents-mounted');

      // Check that the content exists in the DOM (mounted) but is not visible
      await expect(page.locator('ion-popover ion-content')).toBeAttached();
      await expect(page.locator('ion-popover ion-content')).not.toBeVisible();
    });

    test('should keep component mounted after dismissing if true', async ({ page }) => {
      await page.goto('/lazy/keep-contents-mounted');

      await page.locator('#open-popover').click();

      await expect(page.locator('ion-popover ion-content')).toBeVisible();

      await page.locator('ion-popover ion-button').click();

      await expect(page.locator('ion-popover')).not.toBeVisible();
      await expect(page.locator('ion-popover')).toHaveClass(/overlay-hidden/);

      // Content should be mounted but not visible after dismissal
      await expect(page.locator('ion-popover ion-content')).toBeAttached();
      await expect(page.locator('ion-popover ion-content')).not.toBeVisible();
    });
  });
});
