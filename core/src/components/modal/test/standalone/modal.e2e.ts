import { test } from '@utils/test/playwright';

test.describe('modal: standalone', () => {
  test('should open even without an ion-app', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');
    await page.goto('/src/components/modal/test/standalone');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

    await page.click('#basic-modal');
    await ionModalDidPresent.next();

    const modal = await page.locator('ion-modal');
    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

    await ionModalDidDismiss.next();

    await page.waitForSelector('ion-modal', { state: 'detached' });
  });
});
