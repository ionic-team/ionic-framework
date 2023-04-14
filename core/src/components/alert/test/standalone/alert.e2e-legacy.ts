import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('alert: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/alert/test/standalone`);

    const alert = page.locator('ion-alert');
    const didPresent = await page.spyOnEvent('ionAlertDidPresent');

    await page.click('#basic');
    await didPresent.next();

    await expect(alert).toHaveScreenshot(`alert-standalone-${page.getSnapshotSettings()}.png`);
  });
});
