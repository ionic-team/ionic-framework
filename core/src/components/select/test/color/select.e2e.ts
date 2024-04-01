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
      title('input: color'),
      () => {
        test.describe(
          'input: fill none',
          () => {
            test('should set label and highlight color on expand', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-select label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
                config
              );

              const select =
                page.locator(
                  'ion-select'
                );
              await expect(
                select
              ).toHaveScreenshot(
                screenshot(
                  `select-no-fill-color`
                )
              );
            });
          }
        );
        test.describe(
          'input: fill solid',
          () => {
            test('should set label and highlight color on expand', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-select fill="solid" label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
                config
              );

              const select =
                page.locator(
                  'ion-select'
                );
              await expect(
                select
              ).toHaveScreenshot(
                screenshot(
                  `select-solid-color`
                )
              );
            });
          }
        );
        test.describe(
          'input: fill outline',
          () => {
            test('should set label and highlight color on expand', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-select fill="outline" label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        `,
                config
              );

              const select =
                page.locator(
                  'ion-select'
                );
              await expect(
                select
              ).toHaveScreenshot(
                screenshot(
                  `select-outline-color`
                )
              );
            });
          }
        );
      }
    );
  }
);
