import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/picker/test/trigger');
  });

  test('should open the picker', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    const picker = page.locator('#default-picker');

    await page.click('#default');

    await ionPickerDidPresent.next();
    await expect(picker).toBeVisible();
  });

  test('should present a previously presented picker', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    const ionPickerDidDismiss = await page.spyOnEvent('ionPickerDidDismiss');
    const picker = page.locator('#timeout-picker');

    await page.click('#timeout');

    await ionPickerDidDismiss.next();

    await page.click('#timeout');

    await ionPickerDidPresent.next();
    await expect(picker).toBeVisible();
  });
});
