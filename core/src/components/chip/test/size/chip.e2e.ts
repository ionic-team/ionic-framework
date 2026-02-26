import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: size'), () => {
    test('should render small chip', async ({ page }) => {
      await page.setContent(
        `<ion-chip size="small">
          <ion-label>Small</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-size-small`));
    });

    test('should render large chip', async ({ page }) => {
      await page.setContent(
        `<ion-chip size="large">
          <ion-label>Large</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-size-large`));
    });
  });
});
