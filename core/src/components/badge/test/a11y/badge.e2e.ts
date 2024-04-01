import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('badge: font scaling'),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-badge>123</ion-badge>
      `,
            config
          );

          const badge = page.locator(
            'ion-badge'
          );

          await expect(
            badge
          ).toHaveScreenshot(
            screenshot(`badge-scale`)
          );
        });
      }
    );
  }
);
