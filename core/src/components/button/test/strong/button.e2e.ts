import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * Clear buttons have special font-weight
 * styles which is why we make sure
 * to capture the clear button here.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('button: strong'),
      () => {
        test('should render strong button', async ({
          page,
        }) => {
          await page.setContent(
            `
         <ion-button fill="solid" strong="true">Button</ion-button>
       `,
            config
          );

          const wrapper = page.locator(
            'ion-button'
          );

          await expect(
            wrapper
          ).toHaveScreenshot(
            screenshot(`button-strong`)
          );
        });
        test('should render strong clear button', async ({
          page,
        }) => {
          await page.setContent(
            `
         <ion-button fill="clear" strong="true">Button</ion-button>
       `,
            config
          );

          const wrapper = page.locator(
            'ion-button'
          );

          await expect(
            wrapper
          ).toHaveScreenshot(
            screenshot(
              `button-clear-strong`
            )
          );
        });
      }
    );
    test.describe(
      title('in ion-buttons'),
      () => {
        test('should render strong button', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-buttons>
            <ion-button strong="true" fill="solid">Button</ion-button>
          </ion-buttons>
        `,
            config
          );

          const wrapper = page.locator(
            'ion-button'
          );

          await expect(
            wrapper
          ).toHaveScreenshot(
            screenshot(
              `button-strong-in-buttons`
            )
          );
        });
        test('should render strong clear button', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-buttons>
            <ion-button strong="true" fill="clear">Button</ion-button>
          </ion-buttons>
        `,
            config
          );

          const wrapper = page.locator(
            'ion-button'
          );

          await expect(
            wrapper
          ).toHaveScreenshot(
            screenshot(
              `button-clear-strong-in-buttons`
            )
          );
        });
      }
    );
  }
);
