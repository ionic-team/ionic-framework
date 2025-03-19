import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: spacing'), () => {
    ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'].forEach((spacing) => {
      test(`should render divider with ${spacing} spacing`, async ({ page }) => {
        await page.setContent(
          `
        <style>
            #container {
              padding: 10px;
            }
          </style>

          <div id="container">
            top
            <ion-divider spacing="${spacing}"></ion-divider>
            bottom
          </div>
      `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`divider-spacing-${spacing}`));
      });
    });
  });
});
