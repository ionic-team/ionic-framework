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
      title(
        'back-button: font scaling'
      ),
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

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/" text="Back"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      `,
            config
          );

          const backButton =
            page.locator(
              'ion-back-button'
            );

          await expect(
            backButton
          ).toHaveScreenshot(
            screenshot(
              `back-button-scale`
            )
          );
        });
      }
    );
  }
);
