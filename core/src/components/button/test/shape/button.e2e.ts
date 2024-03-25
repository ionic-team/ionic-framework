import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * All content takes up the full width, so RTL has no effect.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: shape'), () => {
    test.describe('round', () => {
      test.describe('default', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#default');

          await expect(container).toHaveScreenshot(screenshot(`button-round`));
        });
      });

      test.describe('outline', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#outline');

          await expect(container).toHaveScreenshot(screenshot(`button-outline-round`));
        });
      });

      test.describe('clear', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#clear');

          await expect(container).toHaveScreenshot(screenshot(`button-clear-round`));
        });
      });

      test.describe('color', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#color');

          await expect(container).toHaveScreenshot(screenshot(`button-color-round`));
        });
      });

      test.describe('expand', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.goto(`/src/components/button/test/shape`, config);

          await page.setIonViewport();

          const container = page.locator('#expand');

          await expect(container).toHaveScreenshot(screenshot(`button-expand-round`));
        });
      });
    });
  });
});

/**
 * Shape="rectangular" is only available in the Ionic theme.
 */
configs({ directions: ['ltr'], themes: ['ionic'] }).forEach(({ title, screenshot, config }) => {
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
