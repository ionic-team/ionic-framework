import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Fill is only available in MD mode
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: shape'), () => {
    test.describe('fill solid', () => {
      test('should not have visual regressions with round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            shape="round"
            fill="solid"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-solid-round`));
      });
      test('border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-input {
              --border-radius: 10px !important;
            }
          </style>

          <ion-input
            shape="round"
            fill="solid"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-shaped-solid-custom`));
      });
    });
    test.describe('fill outline', () => {
      test('should not have visual regressions with round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            shape="round"
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-round`));
      });
      test('border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-input {
              --border-radius: 10px !important;
            }
          </style>

          <ion-input
            shape="round"
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-custom`));
      });
    });
  });
});

configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: shape'), () => {
    test.describe('fill outline', () => {
      test('should not have visual regressions with soft shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            shape="soft"
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-soft`));
      });

      test('should not have visual regressions with round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            shape="round"
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-input>
          `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-round`));
      });
    });
  });
});
