import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime-button: disabled buttons'), () => {
    test('buttons should not be enabled when component is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime" disabled="true"></ion-datetime-button>
        <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      await expect(page.locator('#date-button')).toBeDisabled();
      await expect(page.locator('#time-button')).toBeDisabled();
    });
    test('buttons should visually be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime-button datetime="datetime" disabled="true"></ion-datetime-button>
        <ion-datetime id="datetime" presentation="date-time" value="2022-01-01T16:30:00"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();

      const datetimeButton = page.locator('ion-datetime-button');
      await expect(datetimeButton).toHaveScreenshot(screenshot(`datetime-button-disabled`));
    });
  });
});
