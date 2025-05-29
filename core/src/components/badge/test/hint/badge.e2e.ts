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

  test.describe(title('badge: hint inside avatar'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#avatar');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-avatar`));
    });
  });

  test.describe(title('badge: hint inside tab button'), () => {
    test('should not have visual regressions when icon is on the top', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#tab-button');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-tab-button-icon-top`));
    });

    test('should not have visual regressions when icon is at the bottom', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#tab-button-icon-bottom');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-tab-button-icon-bottom`));
    });
  });

  test.describe(title('badge: hint inside button'), () => {
    test('should not have visual regressions when icon is on the top', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#button-top');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-button-top`));
    });

    test('should not have visual regressions when icon is at the bottom', async ({ page }) => {
      await page.goto('/src/components/badge/test/hint', config);

      const container = page.locator('#button-bottom');

      await expect(container).toHaveScreenshot(screenshot(`badge-hint-button-bottom`));
    });
  });
});
