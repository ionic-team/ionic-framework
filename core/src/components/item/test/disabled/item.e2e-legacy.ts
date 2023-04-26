import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: disabled state', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/disabled`);

    await page.setIonViewport();

    // TODO: FW-4037 - Fix label color inconsistency between disabled controls
    await expect(page).toHaveScreenshot(`item-disabled-diff-${page.getSnapshotSettings()}.png`);
  });
});
