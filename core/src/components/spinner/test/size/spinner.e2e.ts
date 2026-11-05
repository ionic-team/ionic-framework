import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_SPINNER_SIZES } from '../../spinner.interface';

/**
 * This behavior does not vary across directions.
 *
 * `ios` does not differ from `md`.
 */
configs({ directions: ['ltr'], modes: ['md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('spinner: size'), () => {
    ION_SPINNER_SIZES.forEach((size) => {
      test(`should render ${size} spinner`, async ({ page }) => {
        await page.setContent(
          `
            <ion-spinner size="${size}"></ion-spinner>
          `,
          config
        );

        const spinner = page.locator('ion-spinner');

        await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-${size}`));
      });
    });
  });
});
