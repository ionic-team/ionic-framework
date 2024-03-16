import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: font scaling'), () => {
    test('should scale default button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button>Default</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-default-scale`));
    });

    test('should scale clear button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button fill="clear">Clear</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-clear-scale`));
    });

    test('should scale small button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="small">Small</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-small-scale`));
    });

    test('should scale large button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="large">Large</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-large-scale`));
    });
  });
});
