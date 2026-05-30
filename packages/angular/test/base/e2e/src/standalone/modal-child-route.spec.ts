import { expect, test } from '@playwright/test';

/**
 * Tests for sheet modals in child routes with showBackdrop=false.
 * Parent has buttons + nested outlet; child route contains only the modal.
 * See https://github.com/ionic-team/ionic-framework/issues/30700
 */
test.describe('Modals: Inline Sheet in Child Route (standalone)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal-child-route/child');
  });

  test('should render parent content and child modal', async ({ page }) => {
    await expect(page.locator('#increment-btn')).toBeVisible();
    await expect(page.locator('#decrement-btn')).toBeVisible();
    await expect(page.locator('#background-action-count')).toHaveText('0');
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();
    await expect(page.locator('#modal-content-loaded')).toBeVisible();
  });

  test('should allow interacting with parent content while modal is open in child route', async ({ page }) => {
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();

    await page.locator('#increment-btn').click();
    await expect(page.locator('#background-action-count')).toHaveText('1');
  });

  test('should allow multiple interactions with parent content while modal is open', async ({ page }) => {
    await expect(page.locator('ion-modal.show-modal')).toBeVisible();

    await page.locator('#increment-btn').click();
    await page.locator('#increment-btn').click();
    await expect(page.locator('#background-action-count')).toHaveText('2');

    await page.locator('#decrement-btn').click();
    await expect(page.locator('#background-action-count')).toHaveText('1');
  });
});
