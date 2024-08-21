import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: shape'), () => {
    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
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

        await expect(textarea).toHaveScreenshot(screenshot(`textarea-default`));
      });
    });

    test.describe('soft', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            shape="soft"
            fill="outline"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');

        await expect(textarea).toHaveScreenshot(screenshot(`textarea-soft`));
      });
    });

    test.describe('round', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            shape="round"
            fill="outline"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');

        await expect(textarea).toHaveScreenshot(screenshot(`textarea-round`));
      });
    });

    test.describe('rectangular', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea
            shape="rectangular"
            fill="outline"
            label="Email"
            label-placement="stacked"
            value="hi@ionic.io"
          ></ion-textarea>
        `,
          config
        );

        const textarea = page.locator('ion-textarea');

        await expect(textarea).toHaveScreenshot(screenshot(`textarea-rectangular`));
      });
    });
  });
});
