import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-content does not have mode-specific styling
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: fixed'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/fixed`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`content-fixed`));
    });
  });
});
