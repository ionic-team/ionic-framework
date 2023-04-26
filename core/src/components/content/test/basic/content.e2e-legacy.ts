import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: basic', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'ion-content does not have mode-specific styling');

    await page.goto(`/src/components/content/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`content-diff-${page.getSnapshotSettings()}.png`);
  });
});
