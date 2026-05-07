import { expect, test } from '@playwright/test';

/**
 * Simulates a pull-to-refresh gesture by dragging from the top of
 * the content element downward with intermediate steps so the
 * gesture recognizer detects the movement.
 */
const pullDown = async (page: import('@playwright/test').Page, distance: number) => {
  const content = page.locator('ion-content');
  const box = await content.boundingBox();
  if (!box) throw new Error('ion-content not visible');

  const startX = box.x + box.width / 2;
  const startY = box.y + 30;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY + distance, { steps: 20 });
  await page.mouse.up();
};

test.describe('refresher: angular standalone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/refresher');
  });

  test('should emit ionPullStart and ionPullEnd with cancel reason', async ({ page }) => {
    // Small drag that doesn't reach the refresh threshold
    await pullDown(page, 60);

    await page.waitForTimeout(500);

    await expect(page.locator('#pull-start-count')).toHaveText('1');
    await expect(page.locator('#refresh-count')).toHaveText('0');
    await expect(page.locator('#pull-end-count')).toHaveText('1');
    await expect(page.locator('#pull-end-reason')).toHaveText('cancel');
  });

  test('should emit ionPullStart, ionRefresh, and ionPullEnd with complete reason', async ({ page }) => {
    // Large drag past the refresh threshold
    await pullDown(page, 300);

    await page.waitForTimeout(1000);

    await expect(page.locator('#pull-start-count')).toHaveText('1');
    await expect(page.locator('#refresh-count')).toHaveText('1');
    await expect(page.locator('#pull-end-count')).toHaveText('1');
    await expect(page.locator('#pull-end-reason')).toHaveText('complete');
  });
});
