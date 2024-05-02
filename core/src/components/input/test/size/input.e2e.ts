import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Size is only available in the Ionic theme
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: size'), () => {
    test.describe('input: size medium', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Email"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-medium`));
      });
      test('should render correctly with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-medium-label-stacked`));
      });
      test('should not have visual regressions with fill outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-medium-outline`));
      });
      test('should not have visual regressions with fill outline and round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            shape="round"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-medium-outline-round`));
      });
    });

    test.describe('input: size large', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            size="large"
            label="Email"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large`));
      });
      test('should render correctly with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            size="large"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large-label-stacked`));
      });
      test('should not have visual regressions with fill outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            size="large"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large-outline`));
      });
      test('should not have visual regressions with fill outline and round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            shape="round"
            size="large"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large-outline-round`));
      });
    });

    test.describe.only('input: size xlarge', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            size="xlarge"
            label="Email"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-xlarge`));
      });
      test('should render correctly with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            size="xlarge"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-xlarge-label-stacked`));
      });
      test('should not have visual regressions with fill outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            size="xlarge"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-xlarge-outline`));
      });
      test('should not have visual regressions with fill outline and round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            shape="round"
            size="xlarge"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-xlarge-outline-round`));
      });
    });
  });
});
