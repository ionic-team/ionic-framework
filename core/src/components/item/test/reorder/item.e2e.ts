import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: reorder'), () => {
    keepSafariHairlines(config);

    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/reorder`, config);

      await page.setIonViewport();

      await page.click('text=Edit');

      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`item-reorder-diff`));
    });
  });
});
