import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES } from '../../../badge/badge.interfaces';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: badge'), () => {
    ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'].forEach((avatarSize) => {
      test(`${avatarSize} - should not have visual regressions with badges`, async ({ page }) => {
        const positions = ['top', 'bottom'];
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const avatars = positions
          .flatMap((position) =>
            ION_BADGE_SIZES.flatMap((badgeSize) =>
              contents.map(
                (html) => `
              <ion-avatar size="${avatarSize}">
                <img src="/src/components/avatar/test/avatar.svg" />
                <ion-badge hue="bold" color="danger" shape="round" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
              </ion-avatar>
            `
              )
            )
          )
          .join('\n');

        await page.setContent(
          `
            <style>
              #container {
                display: flex;
                flex-wrap: wrap;
                gap: 40px;
                padding: 16px;
              }
            </style>

            <div id="container">
              ${avatars}
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        /**
         * Avatars with badges overflow the default viewport, causing
         * unrendered areas to appear black in the screenshot.
         * Resizing to fit content.
         */
        const box = await container.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width) + 40, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`avatar-${avatarSize}-badge`));
      });
    });
  });
});
