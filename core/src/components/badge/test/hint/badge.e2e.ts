import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hint empty'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#empty');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-empty`));
    });

    test('badge: hint inside avatar, should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#avatar');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-avatar`));
    });

    test('badge: hint inside tab button, should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#tab-button');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-tab-button`));
    });

    test('badge: hint inside tab button when tab button has icon at bottom, should not have visual regressions', async ({
      page,
    }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#tab-button-icon-bottom');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-tab-button-icon-bottom`));
    });
  });
});
