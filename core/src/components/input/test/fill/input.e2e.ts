import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Fill is only available in MD mode
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: fill'), () => {
    test.describe('input: fill solid', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-solid`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-solid-label-floating`));
      });
      test('should not have visual regressions with shaped solid', async ({ page }) => {
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-shaped-solid`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-input {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
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
    test.describe('input: fill outline', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-label-floating`));
      });
      test('should not have visual regressions with shaped outline', async ({ page }) => {
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-shaped-outline`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-input {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>

          <ion-input
            shape="round"
            fill="outline"
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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-shaped-outline-custom`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: label slot'), () => {
    test('should render the notch correctly with a slotted label', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .custom-label {
            font-size: 30px;
          }
        </style>
        <ion-input
          fill="outline"
          label-placement="stacked"
          value="apple"
        >
          <div slot="label" class="custom-label">My Label Content</div>
        </ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-slotted-label`));
    });
    test('should render the notch correctly with a slotted label after the input was originally hidden', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          .custom-label {
            font-size: 30px;
          }
        </style>
        <ion-input
          fill="outline"
          label-placement="stacked"
          value="apple"
          style="display: none"
        >
          <div slot="label" class="custom-label">My Label Content</div>
        </ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');

      await input.evaluate((el: HTMLIonSelectElement) => el.style.removeProperty('display'));

      await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-hidden-slotted-label`));
    });
  });
  test.describe(title('input: notch cutout'), () => {
    test('notch cutout should be hidden when no label is passed', async ({ page }) => {
      await page.setContent(
        `
        <ion-input fill="outline" label-placement="stacked" aria-label="my input"></ion-input>
      `,
        config
      );

      const notchCutout = page.locator('ion-input .input-outline-notch');
      await expect(notchCutout).toBeHidden();
    });
  });
});
