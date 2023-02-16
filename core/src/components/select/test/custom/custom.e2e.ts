import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: custom', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/select/test/custom`);

    await expect(page).toHaveScreenshot(`select-custom-diff-${page.getSnapshotSettings()}.png`);
  });
});
