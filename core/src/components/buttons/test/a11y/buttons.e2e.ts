import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('buttons: font scaling'), () => {
    test('should scale default button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 135%;
          }
        </style>

        <ion-buttons>
          <ion-button>Default</ion-button>
        </ion-buttons>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`buttons-default-scale`));
    });

    test('should scale clear button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 135%;
          }
        </style>

        <ion-buttons>
          <ion-button fill="clear">Clear</ion-button>
        </ion-buttons>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`buttons-clear-scale`));
    });

    test('should scale button with icon on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 135%;
          }
        </style>

        <ion-buttons>
          <ion-button>
            <ion-icon slot="start" name="star"></ion-icon>
            Default
          </ion-button>
        </ion-buttons>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`buttons-icon-scale`));
    });

    test('should scale button with icon only on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 135%;
          }
        </style>

        <ion-buttons>
          <ion-button>
            <ion-icon slot="icon-only" name="person-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`buttons-icon-only-scale`));
    });
  });
});
