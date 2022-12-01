import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('alert: standalone', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/alert/test/standalone`, config);

      const alert = page.locator('ion-alert');
      const didPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.click('#basic');
      await didPresent.next();

      expect(await alert.screenshot()).toMatchSnapshot(`alert-standalone-${page.getSnapshotSettings()}.png`);
    });
  });
});
