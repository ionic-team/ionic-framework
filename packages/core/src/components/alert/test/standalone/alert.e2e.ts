import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('alert: standalone'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/alert/test/standalone`, config);

      const alert = page.locator('ion-alert');
      const didPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.click('#basic');
      await didPresent.next();

      await expect(alert).toHaveScreenshot(screenshot('alert-standalone'));
    });
  });
});
