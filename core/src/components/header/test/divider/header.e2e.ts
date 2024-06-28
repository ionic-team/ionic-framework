import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: divider'), () => {
    test('should not have visual regressions with divider header', async ({ page }) => {
      await page.goto(`/src/components/header/test/divider`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`ionic-header-divider`));
    });
  });
});
