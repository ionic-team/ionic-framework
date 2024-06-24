import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/title/test/theme-ionic', config);
      const wrapper = page.locator('#header-wrapper');

      await expect(wrapper).toHaveScreenshot(screenshot(`title-basic`));
    });
  });
});
