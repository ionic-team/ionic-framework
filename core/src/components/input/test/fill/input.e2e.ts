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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-solid`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-solid-label-floating`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-shaped-solid`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-shaped-solid-custom`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-outline`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-outline-label-floating`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-shaped-outline`));
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
        expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-fill-shaped-outline-custom`));
      });
    });
  });
});
