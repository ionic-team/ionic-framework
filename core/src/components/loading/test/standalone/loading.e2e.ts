import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('loading: standalone'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/loading/test/standalone', config);
    });
    test('should open a basic loader', async ({ page }) => {
      const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
      const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidPresent');

      await page.click('#basic-loading');

      await ionLoadingDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`loading-standalone-diff`));

      const loading = page.locator('ion-loading');
      await loading.evaluate((el: HTMLIonLoadingElement) => el.dismiss());

      await ionLoadingDidDismiss.next();

      await expect(loading).toBeHidden();
    });
  });
});
