import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('spinner: color', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/spinner/test/color');
  });
  test.describe('spinner: visual regression tests', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setIonViewport();

      await expect(page).toHaveScreenshot(`spinner-color-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
