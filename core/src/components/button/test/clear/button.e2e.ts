import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: clear', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/clear`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`button-clear-${page.getSnapshotSettings()}.png`);
  });
});
