import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: states'), () => {
    test('should render readonly textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" readonly="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-readonly`));
    });

    test('should render disabled textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" disabled="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-disabled`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: states'), () => {
    test.describe(title('disabled'), () => {
      test.describe(title('no fill'), () => {
        test('should render disabled textarea correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
              ></ion-textarea>

              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                class="ion-valid has-focus"
                disabled="true"
              ></ion-textarea>

              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                error-text="Please enter a valid email"
                counter="true"
                maxlength="20"
                class="ion-touched ion-invalid"
                disabled="true"
              ></ion-textarea>

              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                disabled="true"
                color="warning"
              ></ion-textarea>
            </div>
          `,
            config
          );

          // Set the viewport size taller to capture all of the textareas
          await page.setViewportSize({ width: 393, height: 800 });

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-disabled-no-fill`));
        });
      });
    });

    test.describe(title('focused'), () => {
      test('should render focused textarea correctly', async ({ page }) => {
        await page.setContent(
          `
          <div class="container">
            <ion-textarea
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
              class="has-focus"
            ></ion-textarea>

            <ion-textarea
              fill="outline"
              label="Email"
              label-placement="stacked"
              value="hi@ionic.io"
              helper-text="Enter an email"
              counter="true"
              maxlength="20"
              class="has-focus"
            ></ion-textarea>
          </div>
        `,
          config
        );

        const container = page.locator('.container');
        await expect(container).toHaveScreenshot(screenshot(`textarea-focused`));
      });
    });

    test.describe(title('readonly'), () => {
      test.describe(title('no fill'), () => {
        test('should render readonly textarea correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                readonly="true"
              ></ion-textarea>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-readonly-no-fill`));
        });
      });

      test.describe(title('solid'), () => {
        test('should render readonly invalid textarea correctly', async ({ page }) => {
          await page.setContent(
            `
            <div class="container">
              <ion-textarea
                label="Email"
                label-placement="stacked"
                value="hi@ionic.io"
                helper-text="Enter an email"
                counter="true"
                maxlength="20"
                class="ion-touched ion-invalid"
                readonly="true"
              ></ion-textarea>
            </div>
          `,
            config
          );

          const container = page.locator('.container');
          await expect(container).toHaveScreenshot(screenshot(`textarea-readonly-solid-invalid`));
        });
      });
    });
  });
});
