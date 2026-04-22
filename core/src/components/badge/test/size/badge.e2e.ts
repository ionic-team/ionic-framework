import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES } from '../../../badge/badge.interfaces';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: size'), () => {
    ION_BADGE_SIZES.forEach((size) => {
      test(`should render ${size} badges`, async ({ page }) => {
        await page.setContent(
          `
          <div id="container">
            <ion-badge size="${size}"></ion-badge>
            <ion-badge size="${size}">1</ion-badge>
            <ion-badge size="${size}">99+</ion-badge>
            <ion-badge size="${size}">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
          </div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`badge-size-${size}`));
      });
    });
  });
});
