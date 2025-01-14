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
            :root {
              background: #ccc7c7;
            }
          </style>

            <ion-content>
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
            </ion-content>
        `,
          config
        );

        // Used the `ion-content` element to take the screenshot because the `ion-tab-bar`element would not be visible otherwise
        const content = page.locator('ion-content');

        await expect(content).toHaveScreenshot(screenshot(`tab-bar-expand-full`));
      });
    });

    test.describe(title('compact'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              background: #ccc7c7;
            }
          </style>

          <ion-content>
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
          </ion-content>
        `,
          config
        );

        // Used the `ion-content` element to take the screenshot because the `ion-tab-bar`element would not be visible otherwise
        const content = page.locator('ion-content');

        await expect(content).toHaveScreenshot(screenshot(`tab-bar-expand-compact`));
      });
    });
  });
});
