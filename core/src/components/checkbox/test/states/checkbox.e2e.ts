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
      title('checkbox: states'),
      () => {
        test('should render disabled checkbox correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-checkbox disabled>Label</ion-checkbox>
      `,
            config
          );

          const checkbox = page.locator(
            'ion-checkbox'
          );
          await expect(
            checkbox
          ).toHaveScreenshot(
            screenshot(
              `checkbox-disabled`
            )
          );
        });

        test('should render disabled checked checkbox correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-checkbox checked disabled>Label</ion-checkbox>
      `,
            config
          );

          const checkbox = page.locator(
            'ion-checkbox'
          );
          await expect(
            checkbox
          ).toHaveScreenshot(
            screenshot(
              `checkbox-checked-disabled`
            )
          );
        });

        test('should render checked checkbox correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-checkbox checked>Label</ion-checkbox>
      `,
            config
          );

          const checkbox = page.locator(
            'ion-checkbox'
          );
          await expect(
            checkbox
          ).toHaveScreenshot(
            screenshot(
              `checkbox-checked`
            )
          );
        });

        test('should render unchecked checkbox correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-checkbox>Label</ion-checkbox>
      `,
            config
          );

          const checkbox = page.locator(
            'ion-checkbox'
          );
          await expect(
            checkbox
          ).toHaveScreenshot(
            screenshot(
              `checkbox-unchecked`
            )
          );
        });
      }
    );
  }
);
