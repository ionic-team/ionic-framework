import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toast: standalone', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This test does not check LTR vs RTL layouts');
    await page.goto(`/src/components/toast/test/standalone`);
  });
  test('should not have visual regressions', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    const basicButton = page.locator('#basic-toast');
    await basicButton.click();

    await ionToastDidPresent.next();

    await expect(page).toHaveScreenshot(`toast-standalone-${page.getSnapshotSettings()}.png`);
  });
});
