import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: highlight', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/highlight`);

    await page.setIonViewport();

    await expect(await page.screenshot()).toHaveScreenshot(
      `item-highlight-diff-${page.getSnapshotSettings()}.png`,{ animations: 'disabled' }
    );
  });
});
