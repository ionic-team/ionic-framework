import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-datetime show-default-title="true" show-default-buttons="true" presentation="date-time" value="2022-06-06T16:30"></ion-datetime>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');

      await page.waitForSelector('.datetime-ready');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-scale`));
    });
  });
});
