import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: color', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();

    await page.goto('/src/components/datetime/test/color');

    const datetime = page.locator('ion-datetime');

    await expect(datetime).toHaveScreenshot(`datetime-color-${page.getSnapshotSettings()}.png`);

    await page.evaluate(() => document.body.classList.toggle('dark'));
    await page.waitForChanges();

    await expect(datetime).toHaveScreenshot(`datetime-color-dark-${page.getSnapshotSettings()}.png`);
  });
});
