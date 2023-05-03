import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: CSS variables'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/css-variables`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-css-vars-diff`));
    });
  });
});
