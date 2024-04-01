import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * iOS does not have any color theming besides the
 * caret which cannot be captured in a stable manner in screenshots.
 */
configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('input: color'),
      () => {
        /**
         * Manually setting the .has-focus class
         * lets us quickly test the rendering of a
         * focused input without need to wait for
         * focus events.
         */
        test.describe(
          'input: fill none',
          () => {
            test('should set label and highlight color on focus with start label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
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
                  `input-no-fill-color-start`
                )
              );
            });
            test('should set label and highlight color on focus with end label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
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
                  `input-no-fill-color-end`
                )
              );
            });
            test('should set label and highlight color on focus with fixed label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
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
                  `input-no-fill-color-fixed`
                )
              );
            });
            test('should set label and highlight color on focus with floating label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
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
                  `input-no-fill-color-floating`
                )
              );
            });
            test('should set label and highlight color on focus with stacked label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
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
                  `input-no-fill-color-stacked`
                )
              );
            });
          }
        );
        test.describe(
          'input: fill solid',
          () => {
            test('should set label and highlight color on focus with start label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
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
                  `input-solid-color-start`
                )
              );
            });
            test('should set label and highlight color on focus with end label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
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
                  `input-solid-color-end`
                )
              );
            });
            test('should set label and highlight color on focus with fixed label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
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
                  `input-solid-color-fixed`
                )
              );
            });
            test('should set label and highlight color on focus with floating label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
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
                  `input-solid-color-floating`
                )
              );
            });
            test('should set label and highlight color on focus with stacked label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="solid" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
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
                  `input-solid-color-stacked`
                )
              );
            });
          }
        );
        test.describe(
          'input: fill outline',
          () => {
            test('should set label and highlight color on focus with start label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="start" value="hi@ionic.io"></ion-input>
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
                  `input-outline-color-start`
                )
              );
            });
            test('should set label and highlight color on focus with end label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="end" value="hi@ionic.io"></ion-input>
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
                  `input-outline-color-end`
                )
              );
            });
            test('should set label and highlight color on focus with fixed label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="fixed" value="hi@ionic.io"></ion-input>
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
                  `input-outline-color-fixed`
                )
              );
            });
            test('should set label and highlight color on focus with floating label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="floating" value="hi@ionic.io"></ion-input>
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
                  `input-outline-color-floating`
                )
              );
            });
            test('should set label and highlight color on focus with stacked label placement', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-input fill="outline" class="has-focus" color="danger" label="Email" label-placement="stacked" value="hi@ionic.io"></ion-input>
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
                  `input-outline-color-stacked`
                )
              );
            });
          }
        );
      }
    );
  }
);
