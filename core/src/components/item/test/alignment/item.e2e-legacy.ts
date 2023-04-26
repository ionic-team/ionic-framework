import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: alignment', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/alignment`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-alignment-diff-${page.getSnapshotSettings()}.png`);
  });
});
