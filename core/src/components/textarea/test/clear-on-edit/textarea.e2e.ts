import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: clearOnEdit'), () => {
    test('should clear when typed into', async ({ page }) => {
      await page.setContent(`<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      const textarea = page.locator('ion-textarea');
      await textarea.locator('textarea').type('h');

      await ionInput.next();

      await expect(textarea).toHaveJSProperty('value', 'h');
    });

    test('should not clear when tab is pressed', async ({ page }) => {
      await page.setContent(`<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`, config);

      const textarea = page.locator('ion-textarea');
      await textarea.locator('textarea').focus();

      await page.keyboard.press('Tab');
      await page.waitForChanges();

      await expect(textarea).toHaveJSProperty('value', 'abc');
    });
  });
});
