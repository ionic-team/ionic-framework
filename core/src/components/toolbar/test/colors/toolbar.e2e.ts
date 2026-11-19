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

/**
 * The ios focus background is the primary color, so only md and ionic
 * keep the toolbar color on focus and hover. This behavior does not
 * vary across directions.
 */
configs({ directions: ['ltr'], modes: ['md', 'ionic-md'] }).forEach(({ title, config }) => {
  test.describe(title('toolbar: colors states'), () => {
    /**
     * `(any-hover: hover)` evaluates to "none" when the browser reports a
     * touch device, so turn that off to apply the hover rules. Headless
     * Firefox reports no hover capability regardless, so it skips the
     * hover test.
     */
    test.use({
      hasTouch: false,
      isMobile: false,
    });

    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
          <style>
            :root {
              --ion-toolbar-background: green;
              --ion-toolbar-color: yellow;
            }

            /**
             * Without the transition, the state's color applies at once,
             * so the check reads the final color.
             */
            ion-button {
              --ion-button-transition: none;
            }
          </style>

          <ion-toolbar>
            <ion-button id="direct">Button</ion-button>

            <ion-buttons slot="end">
              <ion-button id="in-buttons" fill="solid">Button</ion-button>
            </ion-buttons>
          </ion-toolbar>
        `,
        config
      );
    });

    const getBackgroundColor = (el: Element) => getComputedStyle(el).backgroundColor;

    ['direct', 'in-buttons'].forEach((id) => {
      test(`should keep the toolbar color on a focused solid button (${id})`, async ({ page }) => {
        const button = page.locator(`#${id}`);
        const native = button.locator('.button-native');

        const resting = await native.evaluate(getBackgroundColor);

        await button.evaluate((el) => el.classList.add('ion-focused'));

        expect(await native.evaluate(getBackgroundColor)).toBe(resting);
      });

      test(`should keep the toolbar color on a hovered solid button (${id})`, async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'Headless Firefox reports no hover capability');

        const button = page.locator(`#${id}`);
        const native = button.locator('.button-native');

        const resting = await native.evaluate(getBackgroundColor);

        await button.hover();

        expect(await native.evaluate(getBackgroundColor)).toBe(resting);
      });
    });
  });
});
