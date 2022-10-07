import { test } from '@utils/test/playwright';

test.describe('loading: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/loading/test/isOpen');
  });

  test('should open the loading indicator', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    await page.click('#default');

    await ionLoadingDidPresent.next();
    await page.waitForSelector('ion-loading', { state: 'visible' });
  });

  test('should open the loading indicator then close after a timeout', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');
    await page.click('#timeout');

    await ionLoadingDidPresent.next();
    await page.waitForSelector('ion-loading', { state: 'visible' });

    await ionLoadingDidDismiss.next();

    await page.waitForSelector('ion-loading', { state: 'hidden' });
  });
});
