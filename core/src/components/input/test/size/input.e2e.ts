import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Size is only available in the Ionic theme
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: size'), () => {
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
      test('should render correctly with floating label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            size="large"
            label="Email"
            label-placement="floating"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large-label-floating`));
      });
      test('should not have visual regressions with fill outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            fill="outline"
            size="large"
            label="Email"
            label-placement="floating"
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
            label-placement="floating"
            value="hi@ionic.io"
          ></ion-input>
        `,
          config
        );

        const input = page.locator('ion-input');
        await expect(input).toHaveScreenshot(screenshot(`input-size-large-outline-round`));
      });
    });
  });
});
