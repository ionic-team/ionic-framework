import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-content does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`content-diff`));
    });
  });
});
