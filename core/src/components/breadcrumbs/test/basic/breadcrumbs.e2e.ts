import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/breadcrumbs/test/basic');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`breadcrumb-diff-${page.getSnapshotSettings()}.png`);
  });
});
