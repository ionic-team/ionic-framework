import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * This behavior does not vary across modes/directions.
   */
  test.describe(title('chip: states'), () => {
    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `<ion-chip disabled="true">
          <ion-label>Disabled</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-disabled`));
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
