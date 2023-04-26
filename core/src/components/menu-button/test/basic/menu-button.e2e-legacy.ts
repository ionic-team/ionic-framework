import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('menu-button: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/menu-button/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`menu-button-diff-${page.getSnapshotSettings()}.png`);
  });
});
