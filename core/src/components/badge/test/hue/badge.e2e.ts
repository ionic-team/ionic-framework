import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_HUES } from '../../../badge/badge.interfaces';

/**
 * This behavior does not vary across modes/directions.
 *
 * `ios` is the same as `md`.
 */
configs({ directions: ['ltr'], modes: ['md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hue'), () => {
    ION_BADGE_HUES.forEach((hue) => {
      test(`should render ${hue} badges`, async ({ page }) => {
        await page.setContent(
          `
        <div id="container">
          <ion-badge hue="${hue}">99</ion-badge>
          <ion-badge hue="${hue}" color="primary">99</ion-badge>
          <ion-badge hue="${hue}" color="secondary">99</ion-badge>
          <ion-badge hue="${hue}" color="tertiary">99</ion-badge>
          <ion-badge hue="${hue}" color="success">99</ion-badge>
          <ion-badge hue="${hue}" color="warning">99</ion-badge>
          <ion-badge hue="${hue}" color="danger">99</ion-badge>
          <ion-badge hue="${hue}" color="light">99</ion-badge>
          <ion-badge hue="${hue}" color="medium">99</ion-badge>
          <ion-badge hue="${hue}" color="dark">99</ion-badge>

          <br>

          <ion-badge hue="${hue}"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="primary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="secondary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="tertiary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="success"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="warning"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="danger"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="light"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="medium"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="${hue}" color="dark"><ion-icon name="logo-ionic"></ion-icon></ion-badge>

          <br>

          <ion-badge hue="${hue}"></ion-badge>
          <ion-badge hue="${hue}" color="primary"></ion-badge>
          <ion-badge hue="${hue}" color="secondary"></ion-badge>
          <ion-badge hue="${hue}" color="tertiary"></ion-badge>
          <ion-badge hue="${hue}" color="success"></ion-badge>
          <ion-badge hue="${hue}" color="warning"></ion-badge>
          <ion-badge hue="${hue}" color="danger"></ion-badge>
          <ion-badge hue="${hue}" color="light"></ion-badge>
          <ion-badge hue="${hue}" color="medium"></ion-badge>
          <ion-badge hue="${hue}" color="dark"></ion-badge>
        </div>
      `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`badge-hue-${hue}`));
      });
    });
  });
});
