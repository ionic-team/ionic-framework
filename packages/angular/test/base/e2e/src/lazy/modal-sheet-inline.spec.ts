import { expect, test } from '@playwright/test';

test.describe('Modals: Inline Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/modal-sheet-inline');
  });

  test('should open inline sheet modal', async ({ page }) => {
    await page.locator('#present-inline-sheet-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('#current-breakpoint')).toHaveText('0.2');
    await expect(page.locator('ion-modal ion-item')).toHaveCount(4);
  });

  test('should expand to 0.75 breakpoint when searchbar is clicked', async ({ page }) => {
    await page.locator('#present-inline-sheet-modal').click();
    await expect(page.locator('#current-breakpoint')).toHaveText('0.2');

    await page.locator('ion-modal ion-searchbar').click();

    await expect(page.locator('#current-breakpoint')).toHaveText('0.75');
  });

  test('should allow interacting with background content while sheet is open', async ({ page }) => {
    await page.locator('#present-inline-sheet-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    await page.locator('#background-action').click();

    await expect(page.locator('#background-action-count')).toHaveText('1');
  });
});
