import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: standalone'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/standalone`, config);

      await expect(page).toHaveScreenshot(screenshot(`content-standalone`), { fullPage: true });
    });
  });
});
