import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: alignment'), () => {
    keepSafariHairlines(config);

    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/alignment`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-alignment-diff`));
    });
  });
});
