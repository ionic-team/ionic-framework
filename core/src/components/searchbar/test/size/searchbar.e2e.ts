import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior only applies to the `ionic` theme.
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('searchbar: size'), () => {
    ['small', 'medium', 'large'].forEach((size) => {
      test(`${size} - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-searchbar size="${size}" show-clear-button="always" value="Filled text"></ion-searchbar>
        `,
          config
        );

        const searchbar = page.locator('ion-searchbar');

        await expect(searchbar).toHaveScreenshot(screenshot(`searchbar-size-${size}`));
      });
    });
  });
});
