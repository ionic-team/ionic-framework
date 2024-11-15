import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 * This behavior is only in the `ionic` theme.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select: size'), () => {
    ['small', 'medium', 'large'].forEach((size) => {
      test(`${size} - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-select 
            size="${size}"
            fill="outline"
            label="Label"
            label-placement="stacked"
            value="filledText"
          >
            <ion-select-option value="filledText">Filled text</ion-select-option>
          </ion-select>
      `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-size-${size}`));
      });
    });
  });
});
