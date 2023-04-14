import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: colors', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/colors`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-colors-diff-${page.getSnapshotSettings()}.png`);
  });
});
