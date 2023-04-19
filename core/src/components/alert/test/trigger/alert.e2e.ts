import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('alert: trigger', () => {
  configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ config, title }) => {
    test(title('should open the alert'), async ({ page }) => {
      await page.goto('/src/components/alert/test/trigger', config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('#default-alert');

      await page.click('#default');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();
    });

    test(title('should present a previously presented alert'), async ({ page }) => {
      await page.goto('/src/components/alert/test/trigger', config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const alert = page.locator('#timeout-alert');

      await page.click('#timeout');

      await ionAlertDidDismiss.next();

      await page.click('#timeout');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();
    });
  });
});
