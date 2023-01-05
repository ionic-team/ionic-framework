import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio-group', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    await page.goto('/src/components/radio-group/test/search');
  });

  test.describe('radio-group: state', () => {
    test('radio should remain checked after being removed/readded to the dom', async ({ page }) => {
      const radioGroup = page.locator('ion-radio-group');
      const radio = page.locator('ion-radio[value=two]');

      // select radio
      await radio.click();
      await expect(radio.locator('input')).toHaveJSProperty('checked', true);

      // filter radio so it is not in DOM
      await page.fill('ion-searchbar input', 'zero');
      await page.waitForChanges();
      await expect(radio).toBeHidden();

      // ensure radio group has the same value
      await expect(radioGroup).toHaveJSProperty('value', 'two');

      // clear the search so the radio appears
      await page.fill('ion-searchbar input', '');
      await page.waitForChanges();

      // ensure that the new radio instance is still checked
      await expect(radio.locator('input')).toHaveJSProperty('checked', true);
    });
  });
});
