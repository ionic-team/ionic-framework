import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-diff-${page.getSnapshotSettings()}.png`);
  });
});
