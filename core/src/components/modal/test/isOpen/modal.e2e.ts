import { test } from '@utils/test/playwright';

test.describe('modal: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');
    await page.goto('/src/components/modal/test/isOpen');
  });

  test('should open the modal', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    await page.click('#default');

    await ionModalDidPresent.next();
    await page.waitForSelector('ion-modal', { state: 'visible' });
  });

  test('should open the modal then close after a timeout', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
    await page.click('#timeout');

    await ionModalDidPresent.next();
    await page.waitForSelector('ion-modal', { state: 'visible' });

    await ionModalDidDismiss.next();

    await page.waitForSelector('ion-modal', { state: 'hidden' });
  });
});
