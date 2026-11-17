import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('note: hue'), () => {
    HUES.forEach((hue) => {
      test(`should render ${hue} notes`, async ({ page }) => {
        await page.setContent(
          `
          <style>
            .container {
              width: max-content;
            }
          </style>

          <div class="container">
            <ion-note hue="${hue}">Default</ion-note>
            <ion-note hue="${hue}" color="danger">Danger</ion-note>
          </div>
        `,
          config
        );

        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`note-hue-${hue}`));
      });
    });
  });
});
