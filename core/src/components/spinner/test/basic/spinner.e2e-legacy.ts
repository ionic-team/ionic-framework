import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('spinner: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/spinner/test/basic');
  });
  test.describe('spinner: visual regression tests', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setIonViewport();

      await expect(page).toHaveScreenshot(`spinner-basic-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
