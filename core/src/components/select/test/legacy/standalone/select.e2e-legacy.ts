import { test } from '@utils/test/playwright';

test.describe('select: standalone', () => {
  test('should open an overlay without ion-app', async ({ page }) => {
    await page.goto(`/src/components/select/test/legacy/standalone`);
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
    const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

    await page.click('#gender');

    await ionAlertDidPresent.next();

    const alert = page.locator('ion-alert');
    await alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());

    await ionAlertDidDismiss.next();
  });
});
