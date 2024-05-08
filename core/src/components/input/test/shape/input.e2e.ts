import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: shape'), () => {
    /**
     * Solid fill is only available in MD theme.
     */
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
  });
});

configs({ modes: ['ionic-md', 'md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: shape'), () => {
    test.describe('default shape', () => {
      test.describe('default fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            <ion-input
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
          await expect(input).toHaveScreenshot(screenshot(`input-shape-default-fill-default`));
        });
      });
    });

    test.describe('round shape', () => {
      test.describe('outline fill', () => {
        test('should not have visual regressions', async ({ page }) => {
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
          await expect(input).toHaveScreenshot(screenshot(`input-shape-round-fill-outline`));
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
          await expect(input).toHaveScreenshot(screenshot(`input-shape-round-fill-outline-custom`));
        });
      });
    });
  });
});
