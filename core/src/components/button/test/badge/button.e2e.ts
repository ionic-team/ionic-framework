import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_BADGE_SIZES, ION_BADGE_VERTICAL_POSITIONS } from '../../../badge/badge.interfaces';
import { ION_BUTTON_SIZES } from '../../button.interface';

const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

const renderRows = (buttonSize: string, buttonContent: string) =>
  ION_BADGE_VERTICAL_POSITIONS.map(
    (position) =>
      `
        <h2>badge position: ${position}</h2>
        <div class="row">${contents
          .flatMap((html) =>
            ION_BADGE_SIZES.map(
              (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
              ${buttonContent}
              <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
            </ion-button>`
            )
          )
          .join('\n')}
        </div>
      `
  ).join('\n');

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: badge'), () => {
    test('should not have visual regressions with badges', async ({ page }) => {
      const sections = ION_BUTTON_SIZES.map(
        (buttonSize) => `
          <h1>button size: ${buttonSize}</h1>
          ${renderRows(buttonSize, '<ion-icon slot="icon-only" name="add"></ion-icon>')}
          ${renderRows(buttonSize, 'Button')}
        `
      ).join('\n');

      await page.setContent(
        `
          <style>
            .row {
              display: grid;
              grid-template-columns: repeat(3, auto);
              justify-items: start;
              align-items: start;
              padding-bottom: 10px;
              row-gap: 5px;
              column-gap: 30px;
            }

            h1 {
              font-size: 14px;
              font-weight: 700;
              color: #3c3f44;
              margin: 20px 0 4px 0;
            }

            h2 {
              font-size: 12px;
              font-weight: 600;
              color: #3c3f44;
              margin: 14px 0 4px 0;
            }
          </style>

          <div class="badge-container">
            ${sections}
          </div>
        `,
        config
      );

      const container = page.locator('.badge-container');

      /**
       * Buttons overflow the default viewport, causing
       * unrendered areas to appear black in the screenshot.
       * Resizing to fit content.
       */
      const box = await container.boundingBox();
      await page.setViewportSize({ width: Math.ceil(box!.width) + 200, height: Math.ceil(box!.height) + 32 });

      await expect(container).toHaveScreenshot(screenshot(`button-badge`));
    });

    test('should space a badge without a position from the label', async ({ page }) => {
      const rows = BUTTON_SIZES.map(
        (buttonSize) => `<div class="row">${contents
          .flatMap((html) =>
            ION_BADGE_SIZES.map(
              (badgeSize) => `<ion-button size="${buttonSize}" shape="round">
                Button
                <ion-badge hue="bold" shape="round" color="danger" size="${badgeSize}">${html}</ion-badge>
              </ion-button>`
            )
          )
          .join('\n')}
        </div>`
      ).join('\n');

      await page.setContent(
        `
          <style>
            .row {
              display: grid;
              grid-template-columns: repeat(3, auto);
              justify-items: start;
              align-items: center;
              padding-bottom: 10px;
              row-gap: 5px;
              column-gap: 30px;
            }
          </style>

          <div class="badge-container">
            ${rows}
          </div>
        `,
        config
      );

      const container = page.locator('.badge-container');

      // Fits the viewport to the content so nothing renders outside it
      const box = await container.boundingBox();
      await page.setViewportSize({ width: Math.ceil(box!.width) + 200, height: Math.ceil(box!.height) + 32 });

      await expect(container).toHaveScreenshot(screenshot(`button-badge-no-position`));
    });
  });
});

/**
 * Stacking does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: badge stacking'), () => {
    test('should keep a badge above the next button', async ({ page }) => {
      await page.setContent(
        `
        <div style="display: flex">
          <ion-button id="with-badge">
            Button
            <ion-badge vertical="top">999+</ion-badge>
          </ion-button>
          <ion-button id="next">Button</ion-button>
        </div>
      `,
        config
      );

      const badgeBox = (await page.locator('#with-badge ion-badge').boundingBox())!;
      const nextBox = (await page.locator('#next').boundingBox())!;

      // The area where the badge overflows into the next button
      const left = Math.max(badgeBox.x, nextBox.x);
      const right = Math.min(badgeBox.x + badgeBox.width, nextBox.x + nextBox.width);
      const top = Math.max(badgeBox.y, nextBox.y);
      const bottom = Math.min(badgeBox.y + badgeBox.height, nextBox.y + nextBox.height);
      expect(right).toBeGreaterThan(left);
      expect(bottom).toBeGreaterThan(top);

      const topmost = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest('ion-badge, ion-button')?.tagName,
        [(left + right) / 2, (top + bottom) / 2]
      );
      expect(topmost).toBe('ION-BADGE');
    });
  });
});
