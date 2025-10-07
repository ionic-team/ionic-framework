import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior only applies to the `ionic` theme.
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-bar: shape'), () => {
    test.describe(title('soft'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-background-color: #ccc7c7;
            }
          </style>

          <ion-tab-bar shape="soft">
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
        `,
          config
        );

        const tabBar = page.locator('ion-tab-bar');

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-shape-soft`));
      });
    });

    test.describe(title('round'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-background-color: #ccc7c7;
            }
          </style>

          <ion-tab-bar shape="round">
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
        `,
          config
        );

        const tabBar = page.locator('ion-tab-bar');

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-shape-round`));
      });
    });

    test.describe(title('rectangular'), () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-background-color: #ccc7c7;
            }
          </style>

          <ion-tab-bar shape="rectangular">
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
        `,
          config
        );

        const tabBar = page.locator('ion-tab-bar');

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-shape-rectangular`));
      });
    });
  });
});
