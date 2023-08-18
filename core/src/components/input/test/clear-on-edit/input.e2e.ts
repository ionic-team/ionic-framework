import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: clearOnEdit'), () => {
    test('should clear when typed into', async ({ page }) => {
      await page.setContent(`<ion-input value="abc" clear-on-edit="true" aria-label="input"></ion-input>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      const input = page.locator('ion-input');
      await input.locator('input').type('h');

      await ionInput.next();

      await expect(input).toHaveJSProperty('value', 'h');
    });

    test('should not clear when enter is pressed', async ({ page }) => {
      await page.setContent(`<ion-input value="abc" clear-on-edit="true" aria-label="input"></ion-input>`, config);

      const input = page.locator('ion-input');
      await input.locator('input').focus();

      await page.keyboard.press('Enter');
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', 'abc');
    });

    test('should not clear when tab is pressed', async ({ page }) => {
      await page.setContent(`<ion-input value="abc" clear-on-edit="true" aria-label="input"></ion-input>`, config);

      const input = page.locator('ion-input');
      await input.locator('input').focus();

      await page.keyboard.press('Tab');
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', 'abc');
    });
  });
});
