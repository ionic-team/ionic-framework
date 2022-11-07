import { test } from '@utils/test/playwright';

test.describe('toast: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/toast/test/isOpen');
  });

  test('should open the toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    await page.click('#default');

    await ionToastDidPresent.next();
    await page.waitForSelector('ion-toast', { state: 'visible' });
  });

  test('should open the toast then close after a timeout', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
    await page.click('#timeout');

    await ionToastDidPresent.next();
    await page.waitForSelector('ion-toast', { state: 'visible' });

    await ionToastDidDismiss.next();

    await page.waitForSelector('ion-toast', { state: 'hidden' });
  });
});
