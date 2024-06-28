import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: divider'), () => {
    test('should not have visual regressions with divider header', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .container {
            padding: 10px;
          }
        </style>
      
        <div class="container">
          <ion-header divider="true">
            <ion-toolbar>
              <ion-title>Header - Divider</ion-title>
            </ion-toolbar>
          </ion-header>
        </div>
      `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`ionic-header-divider`));
    });
  });
});
