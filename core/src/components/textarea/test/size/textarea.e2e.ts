import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Size is only available in the Ionic theme
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: size'), () => {
    test.describe('textarea: size medium', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            label="Email"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-size-medium`));
      });
      test('should render correctly with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-size-medium-label-stacked`));
      });
      test('should not have visual regressions with fill outline', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            fill="outline"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-size-medium-outline`));
      });
      test('should not have visual regressions with fill outline and round shape', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            fill="outline"
            shape="round"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');
        await expect(textarea).toHaveScreenshot(screenshot(`textarea-size-medium-outline-round`));
      });
    });
  });
});
