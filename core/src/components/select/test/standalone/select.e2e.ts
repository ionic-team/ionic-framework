import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('select: standalone', () => {
    test(title('should open an overlay without ion-app'), async ({ page }) => {
      await page.goto(`/src/components/select/test/standalone`, config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      await page.click('#gender');

      await ionAlertDidPresent.next();

      const alert = await page.locator('ion-alert');
      await alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());

      await ionAlertDidDismiss.next();
    });
  });
});
