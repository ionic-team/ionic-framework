import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'], palettes: ['dark', 'light'] }).forEach(({ title, screenshot, config }) => {
  /**
   * This behavior does not vary across modes/directions.
   */
  test.describe(title('chip: states'), () => {
    test('should render disabled state', async ({ page }) => {
      await page.goto(`/src/components/chip/test/states`, config);

      const container = page.locator('#disabled');

      await expect(container).toHaveScreenshot(screenshot(`chip-disabled`));
    });

    test('should render activated state', async ({ page }) => {
      await page.goto(`/src/components/chip/test/states`, config);

      const container = page.locator('#activated');

      await expect(container).toHaveScreenshot(screenshot(`chip-activated`));
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
