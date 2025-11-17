import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('Typography: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/css/test/typography/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`ionic-typography-basic-styles`));
    });
  });
});
