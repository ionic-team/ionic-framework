import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BUTTON_FILLS } from '../../../button/button.interface';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toolbar: colors'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toolbar/test/colors`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`toolbar-colors`));
    });

    /**
     * A button placed directly in a colored toolbar keeps the colors it has
     * outside a toolbar, even when the app sets the toolbar colors. Only the
     * solid background is compared, since an outline button in the ionic
     * theme shows the toolbar through it.
     */
    ION_BUTTON_FILLS.forEach((fill) => {
      test(`should not give toolbar colors to a ${fill} button placed directly in the toolbar`, async ({ page }) => {
        await page.setContent(
          `
            <style>
              :root {
                --ion-toolbar-background: lime;
                --ion-toolbar-color: red;
              }
            </style>

            <ion-toolbar color="danger">
              <ion-button fill="${fill}">Button</ion-button>
            </ion-toolbar>

            <ion-button fill="${fill}">Button</ion-button>
          `,
          config
        );

        const getColors = (el: Element) => {
          const { backgroundColor, color } = getComputedStyle(el);

          return { backgroundColor, color };
        };

        const inToolbar = await page.locator('ion-toolbar ion-button .button-native').evaluate(getColors);
        const outside = await page.locator('ion-toolbar + ion-button .button-native').evaluate(getColors);

        expect(inToolbar.color).toBe(outside.color);

        if (fill === 'solid') {
          expect(inToolbar.backgroundColor).toBe(outside.backgroundColor);
        }
      });
    });
  });
});
