import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr', 'rtl'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
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

    test('should not have visual regressions when inset is enabled', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            top
            <ion-divider inset="true"></ion-divider>
            bottom
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`divider-basic-inset`));
    });
  });
});
