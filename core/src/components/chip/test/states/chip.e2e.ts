import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';
import { ION_CHIP_FILLS } from '../../chip.interface';

/**
 * This behavior does not vary across directions.
 *
 * `md` does not differ from `ios`.
 */
configs({ modes: ['ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: states'), () => {
    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `
          <style>
            /* Styling container to lessen size of screenshot */
            #container {
              display: inline-flex;
            }
          </style>

          <div id="container">
            <ion-chip disabled="true" hue="subtle">
              <ion-label>Disabled</ion-label>
            </ion-chip>
            <ion-chip disabled="true" hue="bold">
              <ion-label>Disabled</ion-label>
            </ion-chip>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`chip-disabled`));
    });
    test('should render focus state', async ({ page }) => {
      await page.setContent(
        `
          <style>
            /* Styling container to prevent overlapping focus rings */
            #container {
              display: inline-flex;
              gap: 12px;
              padding: 8px;
            }
          </style>

          <div id="container">
            <ion-chip class="ion-focused" hue="subtle">
              <ion-label>Focused</ion-label>
            </ion-chip>
            <ion-chip class="ion-focused" hue="bold">
              <ion-label>Focused</ion-label>
            </ion-chip>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`chip-focused`));
    });
    test('should custom chip', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-chip {
            --ion-chip-hue-bold-solid-default-background: green;
            --ion-chip-hue-bold-solid-default-color: black;

            opacity: 1;
          }
        </style>

        <ion-chip hue="bold" fill="solid">
          <ion-label>Custom</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      const backgroundColor = await chip.evaluate((el) => getComputedStyle(el).backgroundColor);
      const color = await chip.evaluate((el) => getComputedStyle(el).color);

      expect(backgroundColor.trim()).toBe('rgb(0, 128, 0)');
      expect(color.trim()).toBe('rgb(0, 0, 0)');
    });
  });
});

/**
 * This behavior does not vary across modes or directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('chip: pressed state'), () => {
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
      ION_CHIP_FILLS.forEach((fill) => {
        ['', 'primary'].forEach((color) => {
          test(`should show the activated background when pressing a hovered ${hue} ${fill} chip${
            color ? ` with a color` : ''
          }`, async ({ page, browserName }) => {
            test.skip(browserName === 'firefox', 'Headless Firefox reports no hover capability');

            const prefix = `--ion-chip-hue-${hue}-${fill}${color ? '-semantic' : ''}`;

            await page.setContent(
              `
                <style>
                  ion-chip {
                    ${prefix}-hover-background: rgb(255, 0, 0);
                    ${prefix}-activated-background: rgb(0, 0, 255);
                  }
                </style>

                <ion-chip hue="${hue}" fill="${fill}"${color ? ` color="${color}"` : ''}>
                  <ion-label>Chip</ion-label>
                </ion-chip>
              `,
              config
            );

            const chip = page.locator('ion-chip');

            await chip.hover();
            await chip.evaluate((el) => el.classList.add('ion-activated'));
            await page.waitForChanges();

            await expect(chip).toHaveCSS('background-color', 'rgb(0, 0, 255)');
          });
        });
      });
    });
  });
});
