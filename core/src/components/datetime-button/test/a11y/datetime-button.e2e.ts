import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * The tested behavior does not vary across directions/modes
 */
configs({
  directions: ['ltr'],
  modes: ['ios'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'datetime-button: font scaling'
      ),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 28px;
          }
        </style>
        <ion-datetime-button locale="en-US" datetime="datetime"></ion-datetime-button>
        <ion-datetime id="datetime" value="2022-01-01T06:30:00" presentation="date-time"></ion-datetime>
      `,
            config
          );

          const datetimeButton =
            page.locator(
              'ion-datetime-button'
            );

          await expect(
            datetimeButton
          ).toHaveScreenshot(
            screenshot(
              `datetime-button-scale`
            )
          );
        });

        test('should wrap text on larger font sizes', async ({
          page,
        }) => {
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

          const datetimeButton =
            page.locator(
              'ion-datetime-button'
            );

          await expect(
            datetimeButton
          ).toHaveScreenshot(
            screenshot(
              `datetime-button-scale-wrap`
            )
          );
        });
      }
    );
  }
);
