import { test } from '@utils/test/playwright';

test.describe('alert: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/alert/test/isOpen');
  });

  test('should open the alert', async ({ page }) => {
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
    await page.click('#default');

    await ionAlertDidPresent.next();
    await page.waitForSelector('ion-alert', { state: 'visible' });
  });

  test('should open the alert then close after a timeout', async ({ page }) => {
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
    const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
    await page.click('#timeout');

    await ionAlertDidPresent.next();
    await page.waitForSelector('ion-alert', { state: 'visible' });

    await ionAlertDidDismiss.next();

    await page.waitForSelector('ion-alert', { state: 'hidden' });
  });
});
