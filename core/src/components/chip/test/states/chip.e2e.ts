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
          // Adding margin so chips aren't overlapping
          <style>
            ion-chip {
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
          // Adding margin so chips aren't overlapping
          <style>
            ion-chip {
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
            --background: green;
            --color: black;

            opacity: 1;
          }
        </style>
        <ion-chip disabled="true">
          <ion-label>Custom</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-custom`));
    });
  });
});
