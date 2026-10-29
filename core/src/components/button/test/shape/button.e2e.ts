import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BUTTON_FILLS, ION_BUTTON_SHAPES, ION_BUTTON_SIZES } from '../../button.interface';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: shape'), () => {
    test('should not have visual regressions', async ({ page }) => {
      const grids = ION_BUTTON_SHAPES.flatMap((shape) =>
        ION_BUTTON_FILLS.map((fill) => {
          // `solid` is the default fill, so it renders without a `fill` attribute
          const fillAttr = fill === 'solid' ? '' : ` fill="${fill}"`;
          // Clear buttons have no background, so focus them to show the shape
          const focusedAttr = fill === 'clear' ? ' class="ion-focused"' : '';
          const sizeAttr = (size: string) => (size === 'medium' ? '' : ` size="${size}"`);
          const attrs = (size: string) => `shape="${shape}"${fillAttr}${sizeAttr(size)}${focusedAttr}`;

          return `
            <div class="grid">
              ${ION_BUTTON_SIZES.map((size) => `<ion-button ${attrs(size)}>Button</ion-button>`).join('')}
              ${ION_BUTTON_SIZES.map(
                (size) => `
                <ion-button ${attrs(size)}>
                  <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
                </ion-button>
              `
              ).join('')}
            </div>
          `;
        })
      ).join('');

      await page.setContent(
        `
        <style>
          .grid {
            display: grid;
            align-items: start;
            justify-items: start;
            grid-template-columns: repeat(3, auto);
            grid-gap: 10px;
            margin-bottom: 10px;
            padding: 6px;
          }
        </style>

        <div class="shapes-container">${grids}</div>
      `,
        config
      );

      const container = page.locator('.shapes-container');

      await expect(container).toHaveScreenshot(screenshot(`button-shape`));
    });
  });
});
