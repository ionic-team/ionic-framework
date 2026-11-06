import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('router-link: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <style>
            .container {
              width: max-content;
            }
          </style>

          <div class="container">
            <ion-router-link href="#">Default</ion-router-link>
            <ion-router-link href="#" color="danger">Danger</ion-router-link>
          </div>
        `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`router-link-basic`));
    });
  });
});
