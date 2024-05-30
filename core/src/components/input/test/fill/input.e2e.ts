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
      test('padding should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-input {
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>

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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-solid-custom`));
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
      test('padding should be customizable', async ({ page }) => {
        /**
         * Requires padding at the top to prevent the label
         * from being clipped by the top of the input.
         */
        await page.setContent(
          `
          <style>
            ion-input {
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>

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
        await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-custom`));
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

configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: ionic theme fill'), () => {
    test('should not have visual regressions with outline fill and stacked label placement', async ({ page }) => {
      await page.setContent(
        `
          <ion-input
            fill="outline"
            label="Email"
            label-placement="stacked"
            placeholder="example@ionic.io"
          ></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-label-stacked`));
    });

    test('should not have visual regressions with outline fill and large size', async ({ page }) => {
      await page.setContent(
        `
          <ion-input
            fill="outline"
            label="Email"
            label-placement="stacked"
            placeholder="example@ionic.io"
            size="large"
          ></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-fill-outline-label-stacked-size-large`));
    });
  });
});
