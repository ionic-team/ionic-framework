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
    title('datetime: hour cycle'),
    () => {
      test('should set the h23 hour cycle correctly', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime hour-cycle="h23" value="2022-01-01T16:30:00"></ion-datetime>
      `,
          config
        );

        const timeButton = page.locator(
          'ion-datetime .time-body'
        );
        await expect(
          timeButton
        ).toHaveText('16:30');
      });
      test('should set the h12 hour cycle correctly', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime hour-cycle="h12" value="2022-01-01T16:30:00"></ion-datetime>
      `,
          config
        );

        const timeButton = page.locator(
          'ion-datetime .time-body'
        );
        await expect(
          timeButton
        ).toHaveText('4:30 PM');
      });
      test('should set the h11 hour cycle correctly', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime hour-cycle="h11" value="2022-01-01T00:30:00"></ion-datetime>
      `,
          config
        );

        const timeButton = page.locator(
          'ion-datetime .time-body'
        );
        await expect(
          timeButton
        ).toHaveText('0:30 AM');
      });
      test('should set the h24 hour cycle correctly', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-datetime hour-cycle="h24" value="2022-01-01T00:30:00"></ion-datetime>
      `,
          config
        );

        const timeButton = page.locator(
          'ion-datetime .time-body'
        );
        await expect(
          timeButton
        ).toHaveText('24:30');
      });
    }
  );
});
