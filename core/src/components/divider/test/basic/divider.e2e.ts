import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            top
            <ion-divider></ion-divider>
            bottom
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`divider-basic-default`));
    });
  });

  test.describe(title('divider: padding'), () => {
    test('should indent the line with horizontal padding', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            top
            <ion-divider class="ion-padding-horizontal"></ion-divider>
            bottom
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`divider-basic-padding`));
    });
  });
});
