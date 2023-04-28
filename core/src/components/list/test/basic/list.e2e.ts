import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('list: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/list/test/basic`, config);

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`list-basic-diff`));
    });
  });
});
