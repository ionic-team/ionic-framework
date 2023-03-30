import { test } from '@utils/test/playwright';

test.describe('action sheet: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/action-sheet/test/isOpen');
  });

  test('should open the action sheet', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    await page.click('#default');

    await ionActionSheetDidPresent.next();
    await page.waitForSelector('ion-action-sheet', { state: 'visible' });
  });

  test('should open the action sheet then close after a timeout', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');
    await page.click('#timeout');

    await ionActionSheetDidPresent.next();
    await page.waitForSelector('ion-action-sheet', { state: 'visible' });

    await ionActionSheetDidDismiss.next();

    await page.waitForSelector('ion-action-sheet', { state: 'hidden' });
  });
});
