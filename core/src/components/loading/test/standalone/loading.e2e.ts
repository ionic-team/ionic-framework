import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('loading: standalone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/loading/test/standalone');
  });
  test('should open a basic loader', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidPresent');

    await page.click('#basic-loading');

    await ionLoadingDidPresent.next();

    await expect(page).toHaveScreenshot(`loading-standalone-diff-${page.getSnapshotSettings()}.png`);

    const loading = page.locator('ion-loading');
    await loading.evaluate((el: HTMLIonLoadingElement) => el.dismiss());

    await ionLoadingDidDismiss.next();

    await expect(loading).toBeHidden();
  });
});
