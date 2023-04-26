import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime-button: disabled buttons', () => {
  test('buttons should not be enabled when component is disabled', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'No mode-specific logic');

    await page.setContent(`
      <ion-datetime-button datetime="datetime" disabled="true"></ion-datetime-button>
      <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    await expect(page.locator('#date-button')).toBeDisabled();
    await expect(page.locator('#time-button')).toBeDisabled();
  });
  test('buttons should visually be disabled', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime" disabled="true"></ion-datetime-button>
      <ion-datetime id="datetime" presentation="date-time" value="2022-01-01T16:30:00"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const datetimeButton = page.locator('ion-datetime-button');
    await expect(datetimeButton).toHaveScreenshot(`datetime-button-disabled-${page.getSnapshotSettings()}.png`);
  });
});
