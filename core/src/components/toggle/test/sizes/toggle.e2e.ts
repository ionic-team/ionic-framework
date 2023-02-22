import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: sizes', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toggle/test/sizes`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`toggle-sizes-diff-${page.getSnapshotSettings()}.png`);
  });
});
