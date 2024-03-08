import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: clearOnEdit'), () => {
    test('should clear the textarea on first keystroke of textarea being focused', async ({ page }) => {
      await page.setContent(`<ion-textarea value="some value" clear-on-edit="true"></ion-textarea>`, config);

      const textarea = page.locator('ion-textarea');

      await textarea.click();
      await textarea.type('h');

      expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('h');

      await textarea.type('ello world');

      expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('hello world');
    });

    test('should not clear the textarea if it does not have an initial value when typing', async ({ page }) => {
      await page.setContent(`<ion-textarea value="" clear-on-edit="true"></ion-textarea>`, config);

      const textarea = page.locator('ion-textarea');

      await textarea.click();
      await textarea.type('hello world');

      expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('hello world');
    });
  });
});
