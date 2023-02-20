import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: fixed', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.mode('ios', 'ion-content does not have mode-specific styling');

    await page.goto(`/src/components/content/test/fixed`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`content-fixed-${page.getSnapshotSettings()}.png`);
  });
});
