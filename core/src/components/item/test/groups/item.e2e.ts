import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: groups'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/groups`, config);

      // Since the list is dynamically created, we need to wait for it to be rendered
      await page.waitForChanges();

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-groups-diff`));
    });
  });
});
