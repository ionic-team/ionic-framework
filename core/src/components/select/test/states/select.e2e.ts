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
      title('select: states'),
      () => {
        test('should render enabled select with a placeholder correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-select label="Favorite Fruit" placeholder="Select a fruit"></ion-select>
      `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          await expect(
            select
          ).toHaveScreenshot(
            screenshot(
              `select-placeholder`
            )
          );
        });

        test('should render enabled select with a value correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-select label="Favorite Fruit" value="apples">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          await expect(
            select
          ).toHaveScreenshot(
            screenshot(`select-value`)
          );
        });

        test('should render disabled select with a placeholder correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-select label="Favorite Fruit" placeholder="Select a fruit" disabled="true"></ion-select>
      `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          await expect(
            select
          ).toHaveScreenshot(
            screenshot(
              `select-disabled-placeholder`
            )
          );
        });

        test('should render disabled select with a value correctly', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-select label="Favorite Fruit" value="apples" disabled="true">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          await expect(
            select
          ).toHaveScreenshot(
            screenshot(
              `select-disabled-value`
            )
          );
        });
      }
    );
  }
);
