import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: activeBarStart', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/activeBarStart`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`range-activeBarStart-diff-${page.getSnapshotSettings()}.png`);
  });
});
