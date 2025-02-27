import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hint empty'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#empty');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-empty`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hint inside avatar'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#avatar');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-avatar`));
    });
  });
});
