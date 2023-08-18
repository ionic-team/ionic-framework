import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ config, title }) => {
  test.describe(title('alert: isOpen'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/alert/test/is-open', config);
    });
    test('should open the alert', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('ion-alert');

      await page.click('#default');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();
    });

    test('should open the alert then close after a timeout', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const alert = page.locator('ion-alert');

      await page.click('#timeout');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();

      await ionAlertDidDismiss.next();
      await expect(alert).toBeHidden();
    });

    test('should open if isOpen is true on load', async ({ page }) => {
      await page.setContent('<ion-alert is-open="true"></ion-alert>', config);
      await expect(page.locator('ion-alert')).toBeVisible();
    });
  });
});
