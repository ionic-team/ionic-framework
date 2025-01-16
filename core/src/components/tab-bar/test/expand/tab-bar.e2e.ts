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

          <ion-content>
            <div class="container">
                <ion-tab-bar expand="full"/>
            </div>
          </ion-content>
          `,
          config
        );

        // Used the `ion-content` element to take the screenshot because the `ion-tab-bar`element would not be visible otherwise
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
               width: 55px;
               height: 95px;
            }
          </style>

          <ion-content>
            <div class="container">
              <ion-tab-bar expand="compact"/>
            </div>
          </ion-content>
          `,
          config
        );

        // Used the `ion-content` element to take the screenshot because the `ion-tab-bar` element would not be visible otherwise
        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`tab-bar-expand-compact`));
      });
    });
  });
});
