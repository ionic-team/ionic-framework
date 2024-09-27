import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 * The round shape is only available in the Ionic and Material Design themes.
 * Shapes with different fill types are only available in the Material Design theme.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: shape'), () => {
    test.describe('fill: solid', () => {
      test.describe('round', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            <ion-textarea
              shape="round"
              fill="solid"
              label="Email"
              label-placement="stacked"
              value="hi@ionic.io"
            ></ion-textarea>
          `,
            config
          );

          const textarea = page.locator('ion-textarea');

          await expect(textarea).toHaveScreenshot(screenshot(`textarea-fill-solid-shape-round`));
        });
      });
    });
  });
});

/**
 * This behavior does not vary across directions
 * The round shape is only available in the Ionic and Material Design themes
 */
configs({ modes: ['md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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
  });
});

/**
 * The soft and rectangular shapes are only available in the Ionic theme
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: shape'), () => {
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
