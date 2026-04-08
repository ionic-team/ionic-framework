import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: badge'), () => {
    ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'].forEach((avatarSize) => {
      test(`${avatarSize} - should not have visual regressions`, async ({ page }) => {
        const badgeSizes = ['small', 'medium', 'large'];
        const positions = ['top', 'bottom'];
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const avatars = positions
          .flatMap((position) =>
            badgeSizes.flatMap((badgeSize) =>
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
          `<div id="container" style="display: flex; flex-wrap: wrap; gap: 20px; padding: 16px;">${avatars}</div>`,
          config
        );

        const container = page.locator('#container');
        await expect(container).toHaveScreenshot(screenshot(`avatar-${avatarSize}-badge`));
      });
    });
  });
});
