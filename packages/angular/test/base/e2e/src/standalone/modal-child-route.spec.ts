import { expect, test } from '@playwright/test';

/**
 * Tests for INLINE sheet modals in child routes with showBackdrop=false.
 *
 * Related issue: https://github.com/ionic-team/ionic-framework/issues/30700
 *
 * This test mimics the EXACT structure from the issue reproduction:
 * - PARENT component has interactive content (buttons) AND a nested ion-router-outlet
 * - CHILD route (rendered in that nested outlet) contains ONLY the modal
 * - The modal has showBackdrop=false
 *
 * The bug: when the modal opens in the child route, the buttons in the PARENT
 * become non-interactive even though showBackdrop=false should allow interaction.
 *
 * DOM structure:
 * - ion-app > ion-router-outlet (root) > PARENT (buttons + nested outlet) > ion-router-outlet > CHILD (modal only)
 */
test.describe('Modals: Inline Sheet in Child Route (standalone)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the child route - this will:
    // 1. Render the parent with buttons
    // 2. Render the child in the nested outlet, which immediately opens the modal
    await page.goto('/standalone/modal-child-route/child');
  });

  test('should render parent content and child modal', async ({ page }) => {
    // Verify the PARENT content is visible (buttons are in parent, not child)
    await expect(page.locator('#increment-btn')).toBeVisible();
    await expect(page.locator('#decrement-btn')).toBeVisible();
    await expect(page.locator('#background-action-count')).toHaveText('0');

    // Verify the modal from CHILD route is visible (opens immediately with isOpen=true)
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();
    await expect(page.locator('#modal-content-loaded')).toBeVisible();
  });

  test('should allow interacting with PARENT content while modal (showBackdrop: false) is open in CHILD route', async ({ page }) => {
    // Modal should already be open (isOpen=true in child component)
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();
    await expect(page.locator('#modal-content-loaded')).toBeVisible();

    // Click the increment button in the PARENT - this should work with showBackdrop=false
    // This is the KEY test - it FAILS due to issue #30700
    await page.locator('#increment-btn').click();

    // Verify the click was registered
    await expect(page.locator('#background-action-count')).toHaveText('1');
  });

  test('should allow multiple interactions with PARENT content while modal is open', async ({ page }) => {
    // Modal should already be open
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();

    // Click increment multiple times
    await page.locator('#increment-btn').click();
    await page.locator('#increment-btn').click();
    await expect(page.locator('#background-action-count')).toHaveText('2');

    // Click decrement
    await page.locator('#decrement-btn').click();
    await expect(page.locator('#background-action-count')).toHaveText('1');
  });
});
