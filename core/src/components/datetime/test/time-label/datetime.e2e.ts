import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('datetime: time label', () => {
    test(title('should render default time label'), async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      const timeLabel = page.locator('ion-datetime .time-header');
      await expect(timeLabel).toHaveText('Time');
    });
    test(title('should not render a custom time label'), async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-default-time-label="false"></ion-datetime>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      const timeLabel = page.locator('ion-datetime .time-header');
      await expect(timeLabel).toHaveText('');
    });
  });
});
