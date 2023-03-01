import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: buttons', () => {
  test('should not have visual regressions', async ({ page }) => {
    /**
     * This test validates that in iOS mode the arrow indicators are
     * added to the end of the ion-item row.
     *
     * In MD mode, these arrow indicators are not present.
     */
    await page.goto(`/src/components/item/test/buttons`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-buttons-diff-${page.getSnapshotSettings()}.png`);
  });
});
