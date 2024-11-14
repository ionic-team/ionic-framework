import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select: shape'), () => {
    ['soft', 'round', 'rectangular'].forEach((shape) => {
      test(`${shape} - should not have visual regressions with outline fill`, async ({ page }) => {
        await page.setContent(
          `
          <ion-select 
            shape="${shape}"
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

        await expect(select).toHaveScreenshot(screenshot(`select-shape-${shape}-fill-outline`));
      });
    });
  });
});

configs({ modes: ['md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select: shape'), () => {
    test('round - should not have visual regressions with outline fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-select
          shape="round"
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
      await expect(select).toHaveScreenshot(screenshot(`select-shape-round-fill-outline`));
    });

    test('round - should not have visual regressions with solid fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-select
          shape="round"
          fill="solid"
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
      await expect(select).toHaveScreenshot(screenshot(`select-shape-round-fill-solid`));
    });
  });
});
