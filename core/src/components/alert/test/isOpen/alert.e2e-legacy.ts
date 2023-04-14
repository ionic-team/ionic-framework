import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('alert: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/alert/test/isOpen');
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
});
