import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * ion-thumbnail does not have mode/RTL-specific logic
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('thumbnail: rendering'),
      () => {
        test('should not have visual regressions when rendering <img>', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/thumbnail/test/basic`,
            config
          );

          const referenceEl =
            page.locator('#img');

          await expect(
            referenceEl
          ).toHaveScreenshot(
            screenshot(
              `thumbnail-img-diff`
            )
          );
        });

        test('size should be customizable in <ion-item>', async ({
          page,
        }) => {
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/22935',
          });

          await page.setContent(
            `
          <ion-item>
            <ion-thumbnail style="--size: 20px">
              <img src="/src/components/thumbnail/test/thumbnail.svg" />
            </ion-thumbnail>
          </ion-item>
        `,
            config
          );

          const item =
            page.locator('ion-item');
          await expect(
            item
          ).toHaveScreenshot(
            screenshot(
              `thumbnail-ion-item-size-diff`
            )
          );
        });
      }
    );
  }
);

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'thumbnail: item rendering'
      ),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.goto(
              `/src/components/thumbnail/test/basic`,
              config
            );
          }
        );

        /**
         * ion-item has mode and RTL specific logic
         * for ion-thumbnail which is why we do not skip
         * RTL and mode tests here.
         */
        test('should not have visual regressions when rendering inside of an <ion-item>', async ({
          page,
        }) => {
          const referenceEl =
            page.locator('#ion-item');

          await expect(
            referenceEl
          ).toHaveScreenshot(
            screenshot(
              `thumbnail-ion-item-diff`
            )
          );
        });
      }
    );
  }
);
