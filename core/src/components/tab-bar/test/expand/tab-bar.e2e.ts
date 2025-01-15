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
          <ion-content>
            <ion-tab-bar expand="full"/>
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
          <ion-content>
              <ion-tab-bar expand="compact"/>
          </ion-content>
          `,
          config
        );

        // Used the `ion-content` element to take the screenshot because the `ion-tab-bar` element would not be visible otherwise
        const content = page.locator('ion-content');

        await expect(content).toHaveScreenshot(screenshot(`tab-bar-expand-compact`));
      });
    });
  });
});
