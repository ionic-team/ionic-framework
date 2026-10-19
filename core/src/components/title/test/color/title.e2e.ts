import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: color'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/title/test/color', config);
      const wrapper = page.locator('#header-wrapper');

      await expect(wrapper).toHaveScreenshot(screenshot(`title-color`));
    });
  });
});
