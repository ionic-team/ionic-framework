import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: shape'), () => {
    test('round - should not have visual regressions', async ({ page }) => {
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
            <ion-progress-bar value="0.50" shape="round"></ion-progress-bar>
          </div>
        `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`progress-bar-shape-round`));
    });

    test('rectangular - should not have visual regressions', async ({ page }) => {
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
            <ion-progress-bar value="0.50" shape="rectangular"></ion-progress-bar>
          </div>
        `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`progress-bar-shape-rectangular`));
    });
  });
});
