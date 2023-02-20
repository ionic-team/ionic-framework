import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: outline', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/outline`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`button-outline-${page.getSnapshotSettings()}.png`);
  });
});
