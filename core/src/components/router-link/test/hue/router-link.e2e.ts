import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('router-link: hue'), () => {
    HUES.forEach((hue) => {
      test(`should render ${hue} router links`, async ({ page }) => {
        await page.setContent(
          `
            <style>
              .container {
                width: max-content;
              }
            </style>

            <div class="container">
              <ion-router-link href="#" hue="${hue}">Default</ion-router-link>
              <ion-router-link href="#" hue="${hue}" color="danger">Danger</ion-router-link>
            </div>
          `,
          config
        );

        const container = page.locator('.container');

        await expect(container).toHaveScreenshot(screenshot(`router-link-hue-${hue}`));
      });
    });
  });
});

/**
 * The bold and subtle hues resolve to the same color in the default
 * light palette, so the screenshots above can't tell them apart.
 * Each hue is given its own color here to verify it reads its own tokens.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router-link: hue tokens'), () => {
    HUES.forEach((hue) => {
      test(`should use the ${hue} hue tokens`, async ({ page }) => {
        await page.setContent(
          `
            <ion-router-link
              id="default"
              href="#"
              hue="${hue}"
              style="--ion-router-link-hue-${hue}-default-color: rgb(1, 2, 3)"
            >Default</ion-router-link>
            <ion-router-link
              id="danger"
              href="#"
              hue="${hue}"
              color="danger"
              style="--ion-router-link-hue-${hue}-semantic-default-color: rgb(4, 5, 6)"
            >Danger</ion-router-link>
          `,
          config
        );

        await expect(page.locator('#default')).toHaveCSS('color', 'rgb(1, 2, 3)');
        await expect(page.locator('#danger')).toHaveCSS('color', 'rgb(4, 5, 6)');
      });
    });
  });
});
