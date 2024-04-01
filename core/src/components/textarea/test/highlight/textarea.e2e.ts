import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * The textarea highlight does not vary across directions.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('textarea: highlights'),
      () => {
        test.describe(
          'textarea: no fill',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-no-fill-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-no-fill-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-no-fill-focus`
                )
              );
            });
          }
        );
        test.describe(
          'textarea: solid',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="solid"
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-solid-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="solid"
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-solid-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="solid"
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-solid-focus`
                )
              );
            });
          }
        );
        test.describe(
          'textarea: outline',
          () => {
            test('should render valid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="outline"
            value="hi@ionic.io"
            class="ion-valid has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-outline-valid`
                )
              );
            });
            test('should render invalid state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="outline"
            value="hi@ionic.io"
            class="ion-touched ion-invalid"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-outline-invalid`
                )
              );
            });
            test('should render focused state correctly', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-textarea
            fill="outline"
            value="hi@ionic.io"
            class="has-focus"
            label="Email"
            error-text="Please enter a valid email"
            helper-text="Enter an email"
            counter="true"
            maxlength="20"
          ></ion-textarea>
        `,
                config
              );

              const textarea =
                page.locator(
                  'ion-textarea'
                );
              await expect(
                textarea
              ).toHaveScreenshot(
                screenshot(
                  `textarea-outline-focus`
                )
              );
            });
          }
        );
      }
    );
  }
);
