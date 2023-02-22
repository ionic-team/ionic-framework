import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('icon: rtl', () => {
  test('should flip icon when rtl is active', async ({ page, skip }) => {
    skip.mode('ios');

    await page.setContent(`
      <ion-icon name="cut" flip-rtl="true"></ion-icon>
    `);

    const icon = page.locator('ion-icon');
    await expect(icon).toHaveScreenshot(`icon-flip-${page.getSnapshotSettings()}.png`);
  });
  test('should not flip icon when rtl is active', async ({ page, skip }) => {
    skip.mode('ios');

    await page.setContent(`
      <ion-icon name="cut" flip-rtl="false"></ion-icon>
    `);

    const icon = page.locator('ion-icon');
    await expect(icon).toHaveScreenshot(`icon-no-flip-${page.getSnapshotSettings()}.png`);
  });
});
