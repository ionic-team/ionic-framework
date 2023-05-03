import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-grid does not have different styling per-mode
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/grid/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`grid-basic`));
    });
  });
});
