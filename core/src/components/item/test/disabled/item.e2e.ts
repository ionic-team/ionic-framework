import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: disabled state', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/disabled`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-disabled-diff-${page.getSnapshotSettings()}.png`);
  });
});
