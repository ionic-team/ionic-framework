import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('datetime: time label'),
    () => {
      test('should render default time label', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime></ion-datetime>
      `,
          config
        );
        await page
          .locator('.datetime-ready')
          .waitFor();

        const timeLabel = page.locator(
          'ion-datetime .time-header'
        );
        await expect(
          timeLabel
        ).toHaveText('Time');
      });
      test('should not render a custom time label', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime show-default-time-label="false"></ion-datetime>
      `,
          config
        );
        await page
          .locator('.datetime-ready')
          .waitFor();

        const timeLabel = page.locator(
          'ion-datetime .time-header'
        );
        await expect(
          timeLabel
        ).toHaveText('');
      });
    }
  );
});
