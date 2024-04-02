import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Fill="clear" does not render differently based on the direction.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('button: fill: clear'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/clear`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-fill-clear`));
    });
  });
});
