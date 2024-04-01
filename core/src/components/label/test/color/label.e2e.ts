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
      title('label: rendering'),
      () => {
        test('should not inherit color from content', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/label/test/color`,
            config
          );

          const item =
            page.locator('ion-item');

          await expect(
            item
          ).toHaveScreenshot(
            screenshot(
              `item-color-inherit`
            )
          );
        });
        test('should set color directly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-label color="danger">Label Text</ion-label>
      `,
            config
          );

          const labelEl = page.locator(
            'ion-label'
          );

          await expect(
            labelEl
          ).toHaveScreenshot(
            screenshot(`label-color`)
          );
        });
        test('should use contrast color when color is set on item', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-item color="danger">
          <ion-label>Label Text</ion-label>
        </ion-item>
      `,
            config
          );

          const labelEl = page.locator(
            'ion-label'
          );

          await expect(
            labelEl
          ).toHaveScreenshot(
            screenshot(
              `label-color-contrast`
            )
          );
        });
        test('should override color even if color set on item', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-item color="danger">
          <ion-label color="dark">Label Text</ion-label>
        </ion-item>
      `,
            config
          );

          const labelEl = page.locator(
            'ion-label'
          );

          await expect(
            labelEl
          ).toHaveScreenshot(
            screenshot(
              `label-color-override`
            )
          );
        });
      }
    );
  }
);
