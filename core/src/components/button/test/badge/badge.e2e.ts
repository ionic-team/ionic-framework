import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES } from '../../../badge/badge.interfaces';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: badge'), () => {
    ['small', 'medium', 'large'].forEach((buttonSize) => {
      test(`${buttonSize} - should not have visual regressions with badges`, async ({ page }) => {
        const positions = ['top', 'bottom'];
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const iconButtons = positions
          .flatMap((position) =>
            contents.map(
              (html) =>
                `<div class="row">${ION_BADGE_SIZES.map(
                  (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
                  <ion-icon slot="icon-only" name="add"></ion-icon>
                  <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                </ion-button>`
                ).join('\n')}</div>`
            )
          )
          .join('\n');

        const textButtons = positions
          .flatMap((position) =>
            contents.map(
              (html) =>
                `<div class="row">${ION_BADGE_SIZES.map(
                  (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
                  Button
                  <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                </ion-button>`
                ).join('\n')}</div>`
            )
          )
          .join('\n');

        await page.setContent(
          `
            <style>
              .row {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                padding-bottom: 10px;
                row-gap: 5px;
                column-gap: 40px;
              }
            </style>

            <div id="container">
              ${iconButtons}
              ${textButtons}
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        /**
         * Buttons overflow the default viewport, causing
         * unrendered areas to appear black in the screenshot.
         * Resizing to fit content.
         */
        const box = await container.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width) + 50, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`button-${buttonSize}-badge`));
      });
    });
  });
});
