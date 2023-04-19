import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('alert: isOpen', () => {
  configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ config, title }) => {
    test(title('should open the alert'), async ({ page }) => {
      await page.goto('/src/components/alert/test/isOpen', config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('ion-alert');

      await page.click('#default');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();
    });

    test(title('should open the alert then close after a timeout'), async ({ page }) => {
      await page.goto('/src/components/alert/test/isOpen', config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const alert = page.locator('ion-alert');

      await page.click('#timeout');

      await ionAlertDidPresent.next();
      await expect(alert).toBeVisible();

      await ionAlertDidDismiss.next();
      await expect(alert).toBeHidden();
    });
  });
});
