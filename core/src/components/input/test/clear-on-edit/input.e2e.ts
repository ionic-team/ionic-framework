import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

const IGNORED_KEYS = ['Enter', 'Tab', 'Shift', 'Meta', 'Alt', 'Control'];

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

    IGNORED_KEYS.forEach((ignoredKey: string) => {
      test.only(`should not clear when ${ignoredKey} is pressed`, async ({ page }) => {
        await page.setContent(`<ion-input value="abc" clear-on-edit="true" aria-label="input"></ion-input>`, config);

        const input = page.locator('ion-input');
        await input.locator('input').focus();

        await page.keyboard.press(ignoredKey);
        await page.waitForChanges();

        await expect(input).toHaveJSProperty('value', 'abc');
      });
    });

    test.only('should clear after when pressing valid key after pressing ignored key', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28633',
      });

      await page.setContent(`<ion-input value="abc" clear-on-edit="true" aria-label="input"></ion-input>`, config);

      const input = page.locator('ion-input');
      await input.locator('input').focus();

      // ignored
      await page.keyboard.press('Shift');
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', 'abc');

      // allowed
      await page.keyboard.press('a');
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', 'a');
    });
  });
});
