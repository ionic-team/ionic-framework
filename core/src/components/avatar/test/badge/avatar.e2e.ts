import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES, ION_BADGE_VERTICAL_POSITIONS } from '../../../badge/badge.interfaces';

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: badge'), () => {
    ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'].forEach((avatarSize) => {
      test(`${avatarSize} - should not have visual regressions with badges`, async ({ page }) => {
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const avatarRows = ION_BADGE_VERTICAL_POSITIONS.map(
          (position) =>
            `
              <h2>badge position: ${position}</h2>
              <div class="row">${contents
                .flatMap((html) =>
                  ION_BADGE_SIZES.map(
                    (badgeSize) => `
                    <ion-avatar size="${avatarSize}">
                      <img src="/src/components/avatar/test/avatar.svg" />
                      <ion-badge hue="bold" color="danger" shape="round" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                    </ion-avatar>`
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
                gap: 30px;
              }

              h2 {
                font-size: 12px;
                font-weight: 600;
                color: #3c3f44;
                margin: 14px 0 4px 0;
              }
            </style>

            <div id="container">
              ${avatarRows}
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        /**
         * Avatars overflow the default viewport, causing
         * unrendered areas to appear black in the screenshot.
         * Resizing to fit content.
         */
        const box = await container.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width) + 50, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`avatar-${avatarSize}-badge`));
      });
    });
  });
});
