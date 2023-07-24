import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The tested behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('loading: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );

      const datetimeButton = page.locator('ion-datetime-button');

      await expect(datetimeButton).toHaveScreenshot(screenshot(`datetime-button-scale`));
    });

    test('should truncate text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 48px;
          }
        </style>
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
        config
      );

      const datetimeButton = page.locator('ion-datetime-button');

      await expect(datetimeButton).toHaveScreenshot(screenshot(`datetime-button-truncate-scale`));
    });
  });
});
