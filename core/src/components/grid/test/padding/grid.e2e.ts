import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: padding'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/grid/test/padding`, config);

      await page.setIonViewport();

      const content = page.locator('ion-content');

      await expect(content).toHaveScreenshot(screenshot('grid-padding'));
    });
  });
});
