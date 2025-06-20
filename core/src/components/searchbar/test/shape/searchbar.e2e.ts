import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior only applies to the `ionic` theme.
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: shape'), () => {
    ['soft', 'round', 'rectangular'].forEach((shape) => {
      test(`${shape} - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <style>
            /* Background styles to show the border radius */
            :root {
              --background: #000;
            }
          </style>

          <ion-searchbar shape="${shape}"></ion-searchbar>
        `,
          config
        );

        const searchbar = page.locator('ion-searchbar');

        await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-shape-${shape}`));
      });
    });
  });
});
