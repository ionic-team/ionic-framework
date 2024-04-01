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
      title('toggle: states'),
      () => {
        test('should render disabled toggle correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-toggle disabled="true">Label</ion-toggle>
      `,
            config
          );

          const toggle = page.locator(
            'ion-toggle'
          );
          await expect(
            toggle
          ).toHaveScreenshot(
            screenshot(
              `toggle-disabled`
            )
          );
        });

        test('should render checked toggle correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-toggle checked="true">Label</ion-toggle>
      `,
            config
          );

          const toggle = page.locator(
            'ion-toggle'
          );
          await expect(
            toggle
          ).toHaveScreenshot(
            screenshot(`toggle-checked`)
          );
        });

        test('should render unchecked toggle correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-toggle>Label</ion-toggle>
      `,
            config
          );

          const toggle = page.locator(
            'ion-toggle'
          );
          await expect(
            toggle
          ).toHaveScreenshot(
            screenshot(
              `toggle-unchecked`
            )
          );
        });
      }
    );
  }
);
