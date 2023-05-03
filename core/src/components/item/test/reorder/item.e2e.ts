import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: reorder'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/reorder`, config);

      await page.setIonViewport();

      await page.click('text=Edit');

      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`item-reorder-diff`));
    });
  });
});
