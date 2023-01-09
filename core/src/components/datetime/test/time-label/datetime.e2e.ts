import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: time label', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('md');
  });
  test('should render default time label', async ({ page }) => {
    await page.setContent(`
      <ion-datetime></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const timeLabel = page.locator('ion-datetime .time-header');
    await expect(timeLabel).toHaveText('Time');
  });
  test('should not render a custom time label', async ({ page }) => {
    await page.setContent(`
      <ion-datetime show-default-time-label="false"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const timeLabel = page.locator('ion-datetime .time-header');
    await expect(timeLabel).toHaveText('');
  });
});
