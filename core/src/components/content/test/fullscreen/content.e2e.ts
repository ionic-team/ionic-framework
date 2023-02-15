import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: fullscreen', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'ion-content does not have mode-specific styling');

    await page.goto(`/src/components/content/test/fullscreen`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`content-fullscreen-${page.getSnapshotSettings()}.png`);
  });
});
