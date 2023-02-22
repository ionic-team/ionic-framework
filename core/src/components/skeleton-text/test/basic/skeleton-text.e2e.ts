import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('skeleton-text: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/skeleton-text/test/basic');

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`skeleton-text-basic-${page.getSnapshotSettings()}.png`);
  });
});
