import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The textarea highlight does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: highlights'), () => {
    test.describe('textarea: no fill', () => {
      test('should render valid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-no-fill-focus`));
      });
      test('should render custom highlight correctly', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea.custom {
              --highlight-color-focused: red;
              --highlight-color-invalid: blue;
              --highlight-color-valid: purple;
              --highlight-height: 6px;
            }
          </style>

          <div class="container">
            <ion-textarea
              value="hi@ionic.io"
              class="custom has-focus"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              value="hi@ionic.io"
              class="custom has-focus ion-valid"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              value="hi@ionic.io"
              class="custom has-focus ion-invalid ion-touched"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>
          </div>
        `,
          config
        );

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`textarea-no-fill-custom-highlight`));
      });
    });
    test.describe('textarea: solid', () => {
      test('should render valid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-solid-focus`));
      });
      test('should render custom highlight correctly', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea.custom {
              --highlight-color-focused: red;
              --highlight-color-invalid: blue;
              --highlight-color-valid: purple;
              --highlight-height: 6px;
            }
          </style>

          <div class="container">
            <ion-textarea
              fill="solid"
              value="hi@ionic.io"
              class="custom has-focus"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              fill="solid"
              value="hi@ionic.io"
              class="custom has-focus ion-valid"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              fill="solid"
              value="hi@ionic.io"
              class="custom has-focus ion-invalid ion-touched"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>
          </div>
        `,
          config
        );

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`textarea-solid-custom-highlight`));
      });
    });
    test.describe('textarea: outline', () => {
      test('should render valid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-valid`));
      });
      test('should render invalid state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-invalid`));
      });
      test('should render focused state correctly', async ({ page }) => {
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

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-outline-focus`));
      });
      test('should render custom highlight correctly', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea.custom {
              --highlight-color-focused: red;
              --highlight-color-invalid: blue;
              --highlight-color-valid: purple;
              --highlight-height: 6px;
            }
          </style>

          <div class="container">
            <ion-textarea
              fill="outline"
              value="hi@ionic.io"
              class="custom has-focus"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              fill="outline"
              value="hi@ionic.io"
              class="custom has-focus ion-valid"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>

            <ion-textarea
              fill="outline"
              value="hi@ionic.io"
              class="custom has-focus ion-invalid ion-touched"
              label="Email"
              error-text="Please enter a valid email"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
            ></ion-textarea>
          </div>
        `,
          config
        );

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`textarea-outline-custom-highlight`));
      });
    });
  });
});
