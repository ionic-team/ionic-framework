import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: text', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/text`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-text-diff-${page.getSnapshotSettings()}.png`);
  });
});
