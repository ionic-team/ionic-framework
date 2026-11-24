import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

import { ION_DIVIDER_SPACINGS } from '../../divider.interface';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: spacing'), () => {
    keepSafariHairlines(config);

    ION_DIVIDER_SPACINGS.forEach((spacing) => {
      test(`should render divider with ${spacing} spacing`, async ({ page }) => {
        await page.setContent(
          `
            <div id="container">
              top
              <ion-divider spacing="${spacing}"></ion-divider>
              bottom
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`divider-spacing-${spacing}`));
      });
    });
  });
});
