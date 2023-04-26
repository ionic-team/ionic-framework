import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: round', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl('All content takes up the full width, so RTL has no effect.');
    await page.goto(`/src/components/button/test/round`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`button-round-${page.getSnapshotSettings()}.png`);
  });
});
