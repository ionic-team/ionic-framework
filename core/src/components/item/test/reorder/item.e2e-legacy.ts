import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: reorder', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/reorder`);

    await page.setIonViewport();

    await page.click('text=Edit');

    await page.waitForChanges();

    await expect(page).toHaveScreenshot(`item-reorder-diff-${page.getSnapshotSettings()}.png`);
  });
});
