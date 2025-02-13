import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/progress-bar/test/basic', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`progress-bar-basic`));
    });
  });
});
