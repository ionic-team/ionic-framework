import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_PROGRESS_BAR_SHAPES } from '../../progress-bar.interfaces';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: shape'), () => {
    ION_PROGRESS_BAR_SHAPES.forEach((shape) => {
      test(`${shape} - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <style>
            .ionic {
              --ion-background-color: #ccc7c7;
            }

            .container {
              padding: 10px;
            }
          </style>

          <div class="container">
            <ion-progress-bar value="0.50" shape="${shape}"></ion-progress-bar>
          </div>
        `,
          config
        );

        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`progress-bar-shape-${shape}`));
      });
    });
  });
});
