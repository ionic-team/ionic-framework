import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: disabled state'), () => {
    keepSafariHairlines(config);

    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/disabled`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-disabled-diff`));
    });
  });
});
