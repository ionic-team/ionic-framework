import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';
import { ION_BUTTON_FILLS } from '../../button.interface';

const states = ['', 'class="ion-focused"', 'class="ion-activated"', 'disabled'];

const colors = ['', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: hue'), () => {
    HUES.forEach((hue) => {
      test(`should render ${hue} buttons in each fill and state`, async ({ page }) => {
        const sections = ION_BUTTON_FILLS.map(
          (fill) => `
            <h2>${fill}</h2>
            ${states
              .map(
                (state) =>
                  `<div class="row">${colors
                    .map(
                      (color) =>
                        `<ion-button hue="${hue}" fill="${fill}" ${color ? `color="${color}"` : ''} ${state}>${
                          color || 'Default'
                        }</ion-button>`
                    )
                    .join('')}</div>`
              )
              .join('\n')}
          `
        ).join('\n');

        await page.setContent(
          `
            <style>
              .hue-container {
                padding: 16px;
              }

              h2 {
                font-size: 12px;
                font-weight: normal;
                color: #6f7378;
                margin: 16px 0 4px;
              }

              .row {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                margin-block-end: 10px;
              }
            </style>

            <div class="hue-container">
              ${sections}
            </div>
          `,
          config
        );

        const container = page.locator('.hue-container');

        // Firefox and Safari leave the area below the viewport transparent
        const box = await container.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

        await expect(container).toHaveScreenshot(screenshot(`button-hue-${hue}`));
      });
    });
  });
});

/**
 * In the ionic theme, the ripple is the only pressed feedback, so pressing
 * a hovered button keeps its text color. This behavior does not vary
 * across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, config }) => {
  test.describe(title('button: hue states'), () => {
    /**
     * `(any-hover: hover)` evaluates to "none" when the browser reports a
     * touch device, so turn that off to apply the hover rules. Headless
     * Firefox reports no hover capability regardless, so it skips the test.
     */
    test.use({
      hasTouch: false,
      isMobile: false,
    });

    HUES.forEach((hue) => {
      ION_BUTTON_FILLS.forEach((fill) => {
        ['', 'primary'].forEach((color) => {
          test(`should keep the hover text color when pressing a ${hue} ${fill} button${
            color ? ` with a color` : ''
          }`, async ({ page, browserName }) => {
            test.skip(browserName === 'firefox', 'Headless Firefox reports no hover capability');

            await page.setContent(
              `
                <style>
                  /**
                   * Without the transition, the state's color applies at once,
                   * so the check reads the final color.
                   */
                  ion-button {
                    --ion-button-transition: none;
                  }
                </style>

                <ion-button hue="${hue}" fill="${fill}" ${color ? `color="${color}"` : ''}>Button</ion-button>
              `,
              config
            );

            const button = page.locator('ion-button');
            const native = button.locator('.button-native');
            const getColor = (el: Element) => getComputedStyle(el).color;

            await button.hover();

            const hovered = await native.evaluate(getColor);

            await button.evaluate((el) => el.classList.add('ion-activated'));

            expect(await native.evaluate(getColor)).toBe(hovered);
          });
        });
      });
    });
  });
});
