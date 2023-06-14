import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Fill is only available in MD mode
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: fill'), () => {
    test.describe('textarea: fill solid', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
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

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-solid`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            fill="solid"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-solid-label-floating`));
      });
      test('should not have visual regressions with shaped solid', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            shape="round"
            fill="solid"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-shaped-solid`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>

          <ion-textarea
            shape="round"
            fill="solid"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-shaped-solid-custom`));
      });
    });
    test.describe('textarea: fill outline', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-outline`));
      });
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            fill="outline"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-outline-label-floating`));
      });
      test('should not have visual regressions with shaped outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            shape="round"
            fill="outline"
            label="Email"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-shaped-outline`));
      });
      test('padding and border radius should be customizable', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea {
              --border-radius: 10px !important;
              --padding-start: 50px !important;
              --padding-end: 50px !important;
            }
          </style>

          <ion-textarea
            shape="round"
            fill="outline"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
            helper-text="Enter your email"
            maxlength="20"
            counter="true"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        expect(await textarea.screenshot()).toMatchSnapshot(screenshot(`textarea-fill-shaped-outline-custom`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: notch cutout'), () => {
    test('notch cutout should be hidden when no label is passed', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea fill="outline" label-placement="stacked" aria-label="my textarea"></ion-textarea>
      `,
        config
      );

      const notchCutout = page.locator('ion-textarea .textarea-outline-notch');
      await expect(notchCutout).toBeHidden();
    });
  });
});
