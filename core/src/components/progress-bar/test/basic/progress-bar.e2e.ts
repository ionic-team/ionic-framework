import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('progress-bar: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/progress-bar/test/basic');

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`progress-bar-basic-${page.getSnapshotSettings()}.png`);
  });
});
