import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: lines', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/lines`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-lines-diff-${page.getSnapshotSettings()}.png`);
  });
});
