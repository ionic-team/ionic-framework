import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: alignment'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/legacy/alignment`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-alignment-diff`));
    });
  });
});
