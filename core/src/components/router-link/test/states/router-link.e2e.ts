import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('router-link: states'), () => {
    test('should not have visual regressions', async ({ page }) => {
      /**
       * The padding keeps the focus ring, which sits outside the
       * link, inside the screenshot.
       *
       * An empty href points at the current page, which the browser
       * counts as visited. Firefox's test browser keeps no history,
       * so its visited links show the default color.
       */
      await page.setContent(
        `
          <style>
            .container {
              width: max-content;
              padding: 8px;
            }

            .container div {
              margin-bottom: 8px;
            }
          </style>

          <div class="container">
            <div>
              <ion-router-link href="#" class="ion-focused">Default</ion-router-link>
              <ion-router-link href="#" class="ion-focused" color="danger">Danger</ion-router-link>
            </div>

            <div>
              <ion-router-link href="#" class="ion-activated">Default</ion-router-link>
              <ion-router-link href="#" class="ion-activated" color="danger">Danger</ion-router-link>
            </div>

            <div>
              <ion-router-link href="">Default</ion-router-link>
              <ion-router-link href="" color="danger">Danger</ion-router-link>
            </div>
          </div>
        `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot(`router-link-states`));
    });
  });
});
