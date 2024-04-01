import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('tabs: placement'),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.setViewportSize({
              width: 300,
              height: 200,
            });
          }
        );
        test('should show tab bar at the top of tabs', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-tabs>
          <ion-tab tab="one">My Content</ion-tab>
          <ion-tab-bar slot="top">
            <ion-tab-button tab="one">One</ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      `,
            config
          );

          const tabs =
            page.locator('ion-tabs');
          await expect(
            tabs
          ).toHaveScreenshot(
            screenshot(
              `tabs-tab-bar-top`
            )
          );
        });
        test('should show tab bar at the bottom of tabs', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-tabs>
          <ion-tab tab="one">My Content</ion-tab>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="one">One</ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      `,
            config
          );

          const tabs =
            page.locator('ion-tabs');
          await expect(
            tabs
          ).toHaveScreenshot(
            screenshot(
              `tabs-tab-bar-bottom`
            )
          );
        });
      }
    );
  }
);
