import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('header: rendering'), () => {
    test('should not have visual regressions with basic header', async ({ page }) => {
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-title>Header - Default</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-diff`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: feature rendering'), () => {
    test('should not have visual regressions with no border', async ({ page }) => {
      await page.setContent(
        `
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <ion-title>Header - No Border</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-no-border-diff`));
    });
  });
});

/**
 * Translucent effect is only available in iOS mode.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: translucent'), () => {
    test('should not have visual regressions with translucent header', async ({ page }) => {
      await page.setContent(
        `
        <ion-header translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
          </div>
          <ion-toolbar>
            <ion-title>Header - Translucent</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-translucent-diff`));
    });

    test('should not have visual regressions with translucent header with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-header translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/header/test/img.jpg" />
          </div>
          <ion-toolbar color="tertiary">
            <ion-title>Header - Translucent</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-translucent-color-diff`));
    });
  });
});
