import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: standalone'), () => {
    test('should open an overlay without ion-app', async ({ page }) => {
      await page.goto(`/src/components/select/test/legacy/standalone`, config);
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');

      await page.click('#gender');

      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      await alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());

      await ionAlertDidDismiss.next();
    });
  });
});
