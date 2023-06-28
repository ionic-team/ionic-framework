import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: autogrow'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/textarea/test/autogrow`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`textarea-autogrow-diff`));
    });

    test('should grow when typing', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea aria-label="Textarea" auto-grow="true"></ion-textarea>
      `,
        config
      );

      const ionTextarea = page.locator('ion-textarea');
      const nativeTextarea = ionTextarea.locator('textarea');

      await nativeTextarea.type('Now, this is a story all about how');

      await page.waitForChanges();
      await expect(ionTextarea).toHaveScreenshot(screenshot(`textarea-autogrow-initial`));

      await nativeTextarea.type(
        [
          `\nMy life got flipped-turned upside down`,
          `And I'd like to take a minute`,
          `Just sit right there`,
          `I'll tell you how I became the prince of a town called Bel-Air`,
        ].join('\n')
      );

      await page.waitForChanges();
      await expect(ionTextarea).toHaveScreenshot(screenshot(`textarea-autogrow-after`));
    });

    test('should break long lines without white space', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25893',
      });

      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-textarea
              aria-label="Textarea"
              auto-grow="true"
              value="abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"></ion-textarea>
          </ion-content>
        </ion-app>`,
        config
      );

      const textarea = page.locator('ion-textarea');

      await expect(textarea).toHaveScreenshot(screenshot(`textarea-autogrow-word-break`));
    });
  });
});
