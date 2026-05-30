import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: states'), () => {
    test('should render enabled state', async ({ page }) => {
      await page.setContent(
        `
        <ion-range>
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      await expect(range).toHaveScreenshot(screenshot(`range-enabled`));
    });

    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `
        <ion-range disabled="true">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      await expect(range).toHaveScreenshot(screenshot(`range-disabled`));
    });

    test('should render disabled state with a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-range value="40%" disabled="true">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      await expect(range).toHaveScreenshot(screenshot(`range-disabled-value`));
    });

    test('should render disabled state with ticks', async ({ page }) => {
      await page.setContent(
        `
        <ion-range snaps="true" ticks="true" step="10" value="10%" disabled>
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      await expect(range).toHaveScreenshot(screenshot(`range-disabled-ticks`));
    });
  });
});
