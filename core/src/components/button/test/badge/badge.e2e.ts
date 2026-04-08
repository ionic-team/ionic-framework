import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: badge'), () => {
    ['small', 'medium', 'large'].forEach((buttonSize) => {
      test(`${buttonSize} - should not have visual regressions with badges`, async ({ page }) => {
        const badgeSizes = ['small', 'medium', 'large'];
        const positions = ['top', 'bottom'];
        const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

        const buttons = positions
          .flatMap((position) =>
            badgeSizes.flatMap((badgeSize) =>
              contents.flatMap((html) => [
                // Icon-only button
                `<ion-button size="${buttonSize}" shape="round">
                <ion-icon slot="icon-only" name="add"></ion-icon>
                <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
              </ion-button>`,
                // Text button
                `<ion-button size="${buttonSize}" shape="round">
                Button
                <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
              </ion-button>`,
              ])
            )
          )
          .join('\n');

        await page.setContent(
          `
            <style>
              /* Prevent badges from overlapping */
              ion-button {
                margin-inline-end: 20px;
              }

              #container {
                padding-bottom: 10px;
              }
            </style>

            <div id="container">
              ${buttons}
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        /**
         * Large buttons overflow the default viewport, causing
         * unrendered areas to appear black in the screenshot.
         * Resizing to fit content.
         */
        if (buttonSize === 'large') {
          const box = await container.boundingBox();

          await page.setViewportSize({ width: Math.ceil(box!.width) + 32, height: Math.ceil(box!.height) + 32 });
        }

        await expect(container).toHaveScreenshot(screenshot(`button-${buttonSize}-badge`));
      });
    });
  });
});
