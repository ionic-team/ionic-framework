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
      title('input: highlights'),
      () => {
        test.describe(
          'input: no fill',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-no-fill-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-no-fill-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-no-fill-focus`
                )
              );
            });
          }
        );
        test.describe(
          'input: solid',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="solid"
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-solid-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="solid"
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-solid-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="solid"
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-solid-focus`
                )
              );
            });
          }
        );
        test.describe(
          'input: outline',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="outline"
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-outline-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="outline"
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-outline-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input
            fill="outline"
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-input>
        `,
                config
              );

              const input =
                page.locator(
                  'ion-input'
                );
              await expect(
                input
              ).toHaveScreenshot(
                screenshot(
                  `input-outline-focus`
                )
              );
            });
          }
        );
      }
    );
  }
);
