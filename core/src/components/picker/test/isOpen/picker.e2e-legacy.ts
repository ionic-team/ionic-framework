import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/picker/test/isOpen');
  });

  test('should open the picker', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    const picker = page.locator('ion-picker');

    await page.click('#default');

    await ionPickerDidPresent.next();
    await expect(picker).toBeVisible();
  });

  test('should open the picker then close after a timeout', async ({ page }) => {
    const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
    const ionPickerDidDismiss = await page.spyOnEvent('ionPickerDidDismiss');
    const picker = page.locator('ion-picker');

    await page.click('#timeout');

    await ionPickerDidPresent.next();
    await expect(picker).toBeVisible();

    await ionPickerDidDismiss.next();
    await expect(picker).toBeHidden();
  });
});
