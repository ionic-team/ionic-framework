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
                gap: 4px;
              }
            </style>

            <div class="hue-container">
              ${sections}
            </div>
          `,
          config
        );

        const container = page.locator('.hue-container');

        await expect(container).toHaveScreenshot(screenshot(`button-hue-${hue}`));
      });
    });
  });
});
