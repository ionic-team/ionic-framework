import { test } from '@utils/test/playwright';

test.describe('action sheet: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/action-sheet/test/trigger');
  });

  test('should open the action sheet', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    await page.click('#default');

    await ionActionSheetDidPresent.next();
    await page.waitForSelector('#default-action-sheet', { state: 'visible' });
  });

  test('should present a previously presented action sheet', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

    await page.click('#timeout');

    await ionActionSheetDidDismiss.next();

    await page.click('#timeout');

    await ionActionSheetDidPresent.next();
    await page.waitForSelector('#timeout-action-sheet', { state: 'visible' });
  });
});
