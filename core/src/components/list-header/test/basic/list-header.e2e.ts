import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('list-header: basic'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/list-header/test/basic`,
            config
          );

          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(`list-header`)
          );
        });
      }
    );
  }
);

/**
 * This behavior needs to be tested in both modes and directions to
 * make sure the safe area padding is applied only to that side
 * regardless of direction
 */
configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('list-header: basic'),
      () => {
        test.describe(
          'safe area',
          () => {
            test('should have padding added by the safe area', async ({
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

          <ion-list-header>
            <ion-label>List Header</ion-label>
            <ion-button>Button</ion-button>
          </ion-list-header>
        `,
                config
              );

              const listHeader =
                page.locator(
                  'ion-list-header'
                );

              await expect(
                listHeader
              ).toHaveScreenshot(
                screenshot(
                  `list-header-safe-area`
                )
              );
            });
          }
        );
      }
    );
  }
);
