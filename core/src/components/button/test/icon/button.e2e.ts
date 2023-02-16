import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: icon', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/icon`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`button-icon-${page.getSnapshotSettings()}.png`);
  });
});
