import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('modal: isOpen', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/isOpen', config);
    });

    test(title('should open the modal'), async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      await page.click('#default');

      await ionModalDidPresent.next();
      await page.waitForSelector('ion-modal', { state: 'visible' });
    });

    test(title('should open the modal then close after a timeout'), async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      await page.click('#timeout');

      await ionModalDidPresent.next();
      await page.waitForSelector('ion-modal', { state: 'visible' });

      await ionModalDidDismiss.next();

      await page.waitForSelector('ion-modal', { state: 'hidden' });
    });
  });
});
