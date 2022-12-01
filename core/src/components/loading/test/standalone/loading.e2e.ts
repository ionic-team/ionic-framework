import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('loading: standalone', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/loading/test/standalone', config);
    });
    test(title('should open a basic loader'), async ({ page }) => {
      const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
      const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidPresent');

      await page.click('#basic-loading');

      await ionLoadingDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`loading-standalone-diff-${page.getSnapshotSettings()}.png`);

      const loading = await page.locator('ion-loading');
      await loading.evaluate((el: HTMLIonLoadingElement) => el.dismiss());

      await ionLoadingDidDismiss.next();

      await expect(loading).toBeHidden();
    });
  });
});
