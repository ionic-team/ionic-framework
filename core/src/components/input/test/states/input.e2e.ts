import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: states'), () => {
    test('should render readonly input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" readonly="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-readonly`));
    });

    test('should render disabled input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" disabled="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-disabled`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: states'), () => {
    test.describe(title('disabled'), () => {
      test.describe(title('no fill'), () => {
        test('should render disabled input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
              ></ion-input>

              <ion-input
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                class="ion-valid has-focus"
                disabled="true"
              ></ion-input>

              <ion-input
                label="Email"
                value="hi@ionic.io"
                error-text="Please enter a valid email"
                counter="true"
                maxlength="20"
                class="ion-touched ion-invalid"
                disabled="true"
              ></ion-input>

              <ion-input
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
                color="warning"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-disabled-no-fill`));
        });
      });

      test.describe(title('outline'), () => {
        test('should render disabled input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                fill="outline"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="outline"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                class="ion-valid has-focus"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="outline"
                label="Email"
                value="hi@ionic.io"
                error-text="Please enter a valid email"
                counter="true"
                maxlength="20"
                class="ion-touched ion-invalid"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="outline"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
                color="warning"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-disabled-outline`));
        });
      });
      test.describe(title('solid'), () => {
        test('should render disabled input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                fill="solid"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="solid"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                class="ion-valid has-focus"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="solid"
                label="Email"
                value="hi@ionic.io"
                error-text="Please enter a valid email"
                counter="true"
                maxlength="20"
                class="ion-touched ion-invalid"
                disabled="true"
              ></ion-input>

              <ion-input
                fill="solid"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
                color="warning"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-disabled-solid`));
        });
      });
    });

    test.describe(title('focused'), () => {
      test('should render focused input correctly', async ({ page }) => {
        await page.setContent(
          `
          <div class="container">
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
              class="has-focus"
            ></ion-input>

            <ion-input
              fill="outline"
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
              class="has-focus"
            ></ion-input>

            <ion-input
              fill="solid"
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
              class="has-focus"
            ></ion-input>
          </div>
        `,
          config
        );

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`input-focused`));
      });
    });

    test.describe(title('readonly'), () => {
      test.describe(title('no fill'), () => {
        test('should render readonly input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                readonly="true"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-readonly-no-fill`));
        });
      });

      test.describe(title('outline'), () => {
        test('should render readonly input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                fill="outline"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                readonly="true"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-readonly-outline`));
        });
      });

      test.describe(title('solid'), () => {
        test('should render readonly input correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-input
                fill="solid"
                label="Email"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                readonly="true"
              ></ion-input>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`input-readonly-solid`));
        });
      });
    });
  });
});
