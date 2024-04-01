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
      title('searchbar: font scaling'),
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
        <ion-searchbar value="My Text" show-cancel-button="always" show-clear-button="always"></ion-searchbar>
      `,
            config
          );

          const searchbar =
            page.locator(
              'ion-searchbar'
            );

          await expect(
            searchbar
          ).toHaveScreenshot(
            screenshot(
              `searchbar-scale`
            )
          );
        });
        test('should scale text on larger font sizes in a toolbar', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-header>
          <ion-toolbar>
            <ion-searchbar value="My Text" show-cancel-button="always" show-clear-button="always"></ion-searchbar>
          </ion-toolbar>
        </ion-header>
      `,
            config
          );

          const searchbar =
            page.locator(
              'ion-searchbar'
            );

          await expect(
            searchbar
          ).toHaveScreenshot(
            screenshot(
              `searchbar-scale-toolbar`
            )
          );
        });
      }
    );
  }
);
