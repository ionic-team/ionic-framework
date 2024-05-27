import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Fill="clear" does not render differently based on the direction.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('button: fill: clear'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/clear`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-fill-clear`));
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * This behavior only applies to Ionic Theme.
   */
  test.describe(title('button: fill: clear'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<div id="container" class="ion-padding">
          <ion-button fill="clear">Default</ion-button>
        </div>`,
        config
      );

      const chip = page.locator('#container');

      await expect(chip).toHaveScreenshot(screenshot(`ionic-button-fill-clear`));
    });
  });
});
