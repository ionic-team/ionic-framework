import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: cols'), () => {
    test('should respect cols when autogrow is not set', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea {
            border: 1px solid red;
          }
        </style>
        <div id="container" style="width: 300px; margin: 20px;">
          <ion-textarea label="Textarea" cols="5" value="Lorem Ipsum"></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot('textarea-cols'));
    });
    test('should ignore cols when autogrow is set', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea {
            border: 1px solid red;
          }
        </style>
        <div id="container" style="width: 300px; margin: 20px;">
          <ion-textarea label="Textarea" cols="5" auto-grow="true" value="Lorem Ipsum"></ion-textarea>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot('textarea-cols-autogrow'));
    });
  });
});
