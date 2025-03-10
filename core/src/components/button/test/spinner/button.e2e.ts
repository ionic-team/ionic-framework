import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md', 'ionic-ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('button: spinner'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/spinner`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-spinner`));
    });
  });
});
