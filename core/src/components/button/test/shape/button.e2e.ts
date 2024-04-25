import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: shape'), () => {
    test.describe('default', () => {
      test.describe('default', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#default #default');

          await expect(container).toHaveScreenshot(screenshot(`button-default`));
        });
      });

      test.describe('outline', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#default #outline');

          await expect(container).toHaveScreenshot(screenshot(`button-default-outline`));
        });
      });

      test.describe('clear', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#default #clear');

          await expect(container).toHaveScreenshot(screenshot(`button-default-clear`));
        });
      });
    });

    test.describe('soft', () => {
      test.describe('default', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#soft #default');

          await expect(container).toHaveScreenshot(screenshot(`button-soft`));
        });
      });

      test.describe('outline', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#soft #outline');

          await expect(container).toHaveScreenshot(screenshot(`button-soft-outline`));
        });
      });

      test.describe('clear', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#soft #clear');

          await expect(container).toHaveScreenshot(screenshot(`button-soft-clear`));
        });
      });
    });

    test.describe('round', () => {
      test.describe('default', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#round #default');

          await expect(container).toHaveScreenshot(screenshot(`button-round`));
        });
      });

      test.describe('outline', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#round #outline');

          await expect(container).toHaveScreenshot(screenshot(`button-round-outline`));
        });
      });

      test.describe('clear', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#round #clear');

          await expect(container).toHaveScreenshot(screenshot(`button-round-clear`));
        });
      });
    });

    test.describe('rectangular', () => {
      test.describe('default', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#rectangular #default');

          await expect(container).toHaveScreenshot(screenshot(`button-rectangular`));
        });
      });

      test.describe('outline', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#rectangular #outline');

          await expect(container).toHaveScreenshot(screenshot(`button-rectangular-outline`));
        });
      });

      test.describe('clear', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#rectangular #clear');

          await expect(container).toHaveScreenshot(screenshot(`button-rectangular-clear`));
        });
      });
    });
  });
});

/**
 * Shape="rectangular" is only available in the Ionic theme.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: shape'), () => {
    test.describe('rectangular', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-button {
              margin: 8px;
            }
          </style>
          <div id="container">
            <ion-button shape="rectangular" fill="solid">Rectangular Button, Solid</ion-button>
            <ion-button class="ion-focused" shape="rectangular" fill="solid">Rectangular Button, Solid, Focused</ion-button>
            <ion-button class="ion-activated" shape="rectangular" fill="solid">Rectangular Button, Solid, Activated</ion-button>

            <ion-button shape="rectangular" fill="outline">Rectangular Button, Outline</ion-button>
            <ion-button class="ion-focused" shape="rectangular" fill="outline">Rectangular Button, Outline, Focused</ion-button>
            <ion-button class="ion-activated" shape="rectangular" fill="outline">Rectangular Button, Outline, Activated</ion-button>

            <ion-button shape="rectangular" fill="clear">Rectangular Button</ion-button>
            <ion-button class="ion-focused" shape="rectangular" fill="clear">Rectangular Button, Focused</ion-button>
            <ion-button class="ion-activated" shape="rectangular" fill="clear">Rectangular Button, Activated</ion-button>
          </div>
          `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`button-shape-rectangular`));
      });
    });
  });
});
