import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: indeterminate', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/checkbox/test/indeterminate`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`checkbox-indeterminate-${page.getSnapshotSettings()}.png`);
  });
});
