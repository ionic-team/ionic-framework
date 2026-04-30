import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES, ION_BADGE_VERTICAL_POSITIONS } from '../../../badge/badge.interfaces';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: badge'), () => {
    ['small', 'medium', 'large'].forEach((buttonSize) => {
      test(`${buttonSize} - should not have visual regressions with badges`, async ({ page }) => {
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const iconButtons = ION_BADGE_VERTICAL_POSITIONS.map(
          (position) =>
            `
              <h2>badge position: ${position}</h2>
              <div class="row">${contents
                .flatMap((html) =>
                  ION_BADGE_SIZES.map(
                    (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
                    <ion-icon slot="icon-only" name="add"></ion-icon>
                    <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                  </ion-button>`
                  )
                )
                .join('\n')}
              </div>
            `
        ).join('\n');

        const textButtons = ION_BADGE_VERTICAL_POSITIONS.map(
          (position) =>
            `
              <h2>badge position: ${position}</h2>
              <div class="row">${contents
                .flatMap((html) =>
                  ION_BADGE_SIZES.map(
                    (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
                    Button
                    <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                  </ion-button>`
                  )
                )
                .join('\n')}
              </div>
            `
        ).join('\n');

        await page.setContent(
          `
            <style>
              .row {
                display: grid;
                grid-template-columns: repeat(3, auto);
                justify-items: start;
                align-items: start;
                padding-bottom: 10px;
                row-gap: 5px;
                column-gap: 30px;
              }

              h2 {
                font-size: 12px;
                font-weight: 600;
                color: #3c3f44;
                margin: 14px 0 4px 0;
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
        await page.setViewportSize({ width: Math.ceil(box!.width) + 200, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`button-${buttonSize}-badge`));
      });
    });
  });
});
