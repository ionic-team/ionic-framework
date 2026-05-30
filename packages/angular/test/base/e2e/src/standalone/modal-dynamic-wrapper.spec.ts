import { expect, test } from '@playwright/test';

test.describe('Modals: Dynamic Wrapper (standalone)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal-dynamic-wrapper');
  });

  test('should render dynamic component inside modal', async ({ page }) => {
    await page.locator('#open-dynamic-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('#dynamic-component-loaded')).toBeVisible();
  });

  test('should allow interacting with background content while sheet is open', async ({ page }) => {
    await page.locator('#open-dynamic-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    await page.locator('#background-action').click();

    await expect(page.locator('#background-action-count')).toHaveText('1');
  });

  test('should prevent interacting with background content when focus is trapped', async ({ page }) => {
    await page.locator('#open-focused-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    // Attempt to click the background button via coordinates; click should be intercepted by backdrop
    const box = await page.locator('#background-action').boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    await expect(page.locator('#background-action-count')).toHaveText('0');
  });
});
