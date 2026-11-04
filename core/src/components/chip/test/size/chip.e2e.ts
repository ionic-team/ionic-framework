import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_CHIP_SIZES } from '../../chip.interface';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: size'), () => {
    ION_CHIP_SIZES.forEach((size) => {
      test(`should render ${size} chip`, async ({ page }) => {
        await page.setContent(
          `<ion-chip size="${size}">
            <ion-label>${size.charAt(0).toUpperCase() + size.slice(1)}</ion-label>
          </ion-chip>`,
          config
        );

        const chip = page.locator('ion-chip');

        await expect(chip).toHaveScreenshot(screenshot(`chip-size-${size}`));
      });
    });
  });
});
