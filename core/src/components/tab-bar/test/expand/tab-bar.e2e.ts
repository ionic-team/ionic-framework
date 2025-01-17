import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior only applies to the `ionic` theme.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-bar: expand'), () => {
    test.describe(title('full'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            .container {
              padding: 20px 10px;
            }
          </style>

          <div class="container">
            <ion-tab-bar expand="full">
              <ion-tab-button tab="1">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="2">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="3">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </div>
          `,
          config
        );

        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`tab-bar-expand-full`));
      });
    });

    test.describe(title('compact'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            .container {
              padding: 20px 10px;
              /* Size is needed because tab bar compact has position absolute and will not capture correctly. */
              width: 225px;
              height: 96px;
            }
          </style>

          <div class="container">
            <ion-tab-bar expand="compact">
              <ion-tab-button tab="1">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="2">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="3">
                <ion-icon name="triangle-outline"></ion-icon>
                <ion-label>Label</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </div>
          `,
          config
        );

        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`tab-bar-expand-compact`));
      });
    });
  });
});
