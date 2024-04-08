import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Link global classes are only available in the Ionic theme.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('link global classes'), () => {
    test.beforeAll(async ({ page }) => {
      await page.goto('/css/test/link/basic/index.html', config);
    });

    test.describe('.ion-link class', () => {
      test('should apply the standard link styles to anchor elements', async ({ page }) => {
        const standalone = page.locator('#standalone');

        await expect(standalone).toHaveScreenshot(screenshot('link-standalone'));
      });

      test('should apply the standard link styles to child anchor elements', async ({ page }) => {
        const standalone = page.locator('#standalone-nested');

        await expect(standalone).toHaveScreenshot(screenshot('link-standalone-nested'));
      });
    });

    test.describe('.ion-link-underline class', () => {
      test('should apply the underline link styles to anchor elements', async ({ page }) => {
        const standalone = page.locator('#underline');

        await expect(standalone).toHaveScreenshot(screenshot('link-underline'));
      });

      test('should apply the underline link styles to child anchor elements', async ({ page }) => {
        const standalone = page.locator('#underline-nested');

        await expect(standalone).toHaveScreenshot(screenshot('link-underline-nested'));
      });
    });
  });
});
