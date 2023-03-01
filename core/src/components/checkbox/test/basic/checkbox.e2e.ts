import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/checkbox/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`checkbox-basic-${page.getSnapshotSettings()}.png`);
  });
});
