import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: slotted inputs', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/slotted-inputs`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-slotted-inputs-${page.getSnapshotSettings()}.png`);
  });
});
