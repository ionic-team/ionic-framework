import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

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
            ion-chip {
              /* Adding margin so chips aren't overlapping */
              margin: 4px 0;
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
            ion-chip {
              /* Adding margin so chips aren't overlapping */
              margin: 4px 0;
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
            --ion-chip-hue-bold-bg: green;
            --ion-chip-hue-bold-color: black;

            opacity: 1;
          }
        </style>

        <ion-chip hue="bold">
          <ion-label>Custom</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      const backgroundColor = await chip.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--ion-chip-hue-bold-bg')
      );
      const color = await chip.evaluate((el) => getComputedStyle(el).getPropertyValue('--ion-chip-hue-bold-color'));

      expect(backgroundColor.trim()).toBe('green');
      expect(color.trim()).toBe('black');
    });
  });
});
