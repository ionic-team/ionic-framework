import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hint'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('ion-list');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint`));
    });
  });
});
