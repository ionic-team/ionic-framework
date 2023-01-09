import { test } from '@utils/test/playwright';

test.describe('picker: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/picker/test/trigger');
  });

  test('should open the picker', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    await page.click('#default');

    await ionPickerDidPresent.next();
    await page.waitForSelector('#default-picker', { state: 'visible' });
  });

  test('should present a previously presented picker', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    const ionPickerDidDismiss = await page.spyOnEvent('ionPickerDidDismiss');

    await page.click('#timeout');

    await ionPickerDidDismiss.next();

    await page.click('#timeout');

    await ionPickerDidPresent.next();
    await page.waitForSelector('#timeout-picker', { state: 'visible' });
  });
});
