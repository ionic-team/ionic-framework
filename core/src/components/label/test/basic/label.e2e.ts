import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('label: rendering'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-label>My Label</ion-label>
      `,
            config
          );

          const labelEl = page.locator(
            'ion-label'
          );

          await expect(
            labelEl
          ).toHaveScreenshot(
            screenshot(`label-basic`)
          );
        });
        test('should not have visual regressions with fixed label', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-item>
          <ion-label>My Label</ion-label>
        </ion-item>
      `,
            config
          );

          const itemEl =
            page.locator('ion-item');

          await expect(
            itemEl
          ).toHaveScreenshot(
            screenshot(`label-fixed`)
          );
        });
        test('should not have visual regressions with stacked label', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-item>
          <ion-label position="stacked">My Label</ion-label>
          <ion-input aria-label="My Label"></ion-input>
        </ion-item>
      `,
            config
          );

          const itemEl =
            page.locator('ion-item');

          await expect(
            itemEl
          ).toHaveScreenshot(
            screenshot(`label-stacked`)
          );
        });
        test('should not have visual regressions with floating label', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-item>
          <ion-label position="floating">My Label</ion-label>
          <ion-input aria-label="My Label"></ion-input>
        </ion-item>
      `,
            config
          );

          const itemEl =
            page.locator('ion-item');

          await expect(
            itemEl
          ).toHaveScreenshot(
            screenshot(`label-floating`)
          );
        });
      }
    );
  }
);
