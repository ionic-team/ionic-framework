import { test } from '@utils/test/playwright';

test.describe('toast: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/toast/test/trigger');
  });

  test('should open the toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    await page.click('#default');

    await ionToastDidPresent.next();
    await page.waitForSelector('#default-toast', { state: 'visible' });
  });

  test('should present a previously presented toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

    await page.click('#timeout');

    await ionToastDidDismiss.next();

    await page.click('#timeout');

    await ionToastDidPresent.next();
    await page.waitForSelector('#timeout-toast', { state: 'visible' });
  });
});
