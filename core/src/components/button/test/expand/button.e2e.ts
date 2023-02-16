import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: expand', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl('All content takes up the full width, so RTL has no effect.');
    await page.goto(`/src/components/button/test/expand`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`button-expand-${page.getSnapshotSettings()}.png`);
  });
});
