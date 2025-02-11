import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: shape'), () => {
    test('should render a round progress bar', async ({ page }) => {
      await page.setContent(
        `
          <style>
            :root {
              background: #ccc7c7;
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

      const tabBar = page.locator('.container');

      await expect(tabBar).toHaveScreenshot(screenshot(`progress-bar-shape-round`));
    });

    test('should render a rectangular progress bar', async ({ page }) => {
      await page.setContent(
        `
          <style>
            :root {
              background: #ccc7c7;
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

      const tabBar = page.locator('.container');

      await expect(tabBar).toHaveScreenshot(screenshot(`progress-bar-shape-rectangular`));
    });
  });
});
