import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('router-link: states'), () => {
    test('should not have visual regressions', async ({ page }) => {
      /**
       * Firefox's test browser keeps no history, so its visited
       * links show the default color.
       */
      await page.setContent(
        `
          <style>
            /* The padding keeps the focus ring inside the screenshot */
            .container {
              width: max-content;
              padding: 8px;
            }

            /* Firefox sizes the container without the focus padding, so the row would wrap */
            .container div {
              margin-bottom: 8px;

              white-space: nowrap;
            }

            /* Keeps the focus backgrounds from touching */
            ion-router-link + ion-router-link {
              margin-inline-start: 8px;
            }
          </style>

          <div class="container">
            <div>
              <ion-router-link href="#" class="ion-focused">Default</ion-router-link>
              <ion-router-link href="#" class="ion-focused" color="danger">Danger</ion-router-link>
              <ion-router-link href="#" class="ion-focused" hue="subtle">Subtle</ion-router-link>
              <ion-router-link href="#" class="ion-focused" hue="subtle" color="danger">Subtle danger</ion-router-link>
            </div>

            <div>
              <ion-router-link href="#" class="ion-activated">Default</ion-router-link>
              <ion-router-link href="#" class="ion-activated" color="danger">Danger</ion-router-link>
              <ion-router-link href="#" class="ion-activated" hue="subtle">Subtle</ion-router-link>
              <ion-router-link href="#" class="ion-activated" hue="subtle" color="danger">Subtle danger</ion-router-link>
            </div>

            <div>
              <ion-router-link href="">Default</ion-router-link>
              <ion-router-link href="" color="danger">Danger</ion-router-link>
              <ion-router-link href="" hue="subtle">Subtle</ion-router-link>
              <ion-router-link href="" hue="subtle" color="danger">Subtle danger</ion-router-link>
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
