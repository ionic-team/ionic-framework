import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: autogrow'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/textarea/test/legacy/autogrow`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`textarea-autogrow-diff`));
    });

    test('should grow when typing', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-content>
            <ion-list>
              <ion-item>
                <ion-textarea auto-grow="true" legacy="true"></ion-textarea>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-app>`,
        config
      );

      const textarea = await page.waitForSelector('ion-textarea');

      await textarea.click();

      await page.waitForChanges();

      await textarea.type('Now, this is a story all about how');

      await page.setIonViewport();

      await expect(textarea).toHaveScreenshot(screenshot(`textarea-autogrow-initial`));

      await textarea.type(
        [
          `\nMy life got flipped-turned upside down`,
          `And I'd like to take a minute`,
          `Just sit right there`,
          `I'll tell you how I became the prince of a town called Bel-Air`,
        ].join('\n')
      );

      await expect(textarea).toHaveScreenshot(screenshot(`textarea-autogrow-after`));
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
              legacy="true"
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
