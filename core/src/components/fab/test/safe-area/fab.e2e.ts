import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('fab: safe area'),
      () => {
        test('should ignore document direction in safe area positioning for start-positioned fab', async ({
          page,
        }) => {
          await page.setContent(
            `
          <style>
            :root {
              --ion-safe-area-left: 40px;
              --ion-safe-area-right: 20px;
            }
          </style>

          <ion-content>
            <ion-fab vertical="center" horizontal="start">
              <ion-fab-button>
                <ion-icon name="add"></ion-icon>
              </ion-fab-button>
            </ion-fab>
          </ion-content>
        `,
            config
          );

          /**
           * We need to capture the entire page to check the fab's position,
           * but we don't need much extra white space.
           */
          await page.setViewportSize({
            width: 200,
            height: 200,
          });

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              'fab-safe-area-horizontal-start'
            )
          );
        });

        test('should ignore document direction in safe area positioning for end-positioned fab', async ({
          page,
        }) => {
          await page.setContent(
            `
          <style>
            :root {
              --ion-safe-area-left: 40px;
              --ion-safe-area-right: 20px;
            }
          </style>

          <ion-content>
            <ion-fab vertical="center" horizontal="end">
              <ion-fab-button>
                <ion-icon name="add"></ion-icon>
              </ion-fab-button>
            </ion-fab>
          </ion-content>
        `,
            config
          );

          /**
           * We need to capture the entire page to check the fab's position,
           * but we don't need much extra white space.
           */
          await page.setViewportSize({
            width: 200,
            height: 200,
          });

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              'fab-safe-area-horizontal-end'
            )
          );
        });
      }
    );
  }
);
