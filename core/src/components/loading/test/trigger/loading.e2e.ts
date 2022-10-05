import { test } from '@utils/test/playwright';

test.describe('loading: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    await page.goto('/src/components/loading/test/trigger');
  });

  test('should open the loading indicator', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    await page.click('#default');

    await ionLoadingDidPresent.next();
    await page.waitForSelector('ion-loading', { state: 'visible' });
  });
});
