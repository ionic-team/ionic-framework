import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('note: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <div class="container">
          <ion-note>Note</ion-note>

          <ion-item>
            <ion-note slot="end">Note</ion-note>
          </ion-item>

          <ion-item-divider>
            <ion-note slot="end">Note</ion-note>
          </ion-item-divider>
        </div>
      `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`note-scale`));
    });
  });
});
