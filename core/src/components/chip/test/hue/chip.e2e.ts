import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';
import { ION_CHIP_FILLS } from '../../chip.interface';

const COLORS = [
  undefined,
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'medium',
  'dark',
];

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('chip: hue'), () => {
    HUES.forEach((hue) => {
      test(`should render ${hue} chips`, async ({ page }) => {
        const rows = ION_CHIP_FILLS.map((fill) =>
          COLORS.map(
            (color) => `
              <ion-chip hue="${hue}" fill="${fill}"${color ? ` color="${color}"` : ''}>
                <ion-icon name="logo-ionic"></ion-icon>
                <ion-label>Chip</ion-label>
              </ion-chip>
            `
          ).join('')
        ).join('<br>');

        await page.setContent(
          `
          <style>
            /* Adding margin so chips aren't overlapping */
            ion-chip {
              margin: 4px 0;
            }
          </style>

          <div id="container">${rows}</div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`chip-hue-${hue}`));
      });
    });
  });
});
