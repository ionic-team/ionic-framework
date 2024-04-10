import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * This behavior only applies to Ionic Theme.
   * TODO(FW-6120): add the `ios` and `md` modes when shape support is added.
   */
  test.describe(title('chip: shape'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/chip/test/shape`, config);
    });

    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
        const container = page.locator('#default');

        await expect(container).toHaveScreenshot(screenshot(`chip-default`));
      });
    });

    test.describe('soft', () => {
      test('should not have visual regressions', async ({ page }) => {
        const container = page.locator('#soft');

        await expect(container).toHaveScreenshot(screenshot(`chip-soft`));
      });
    });

    test.describe('round', () => {
      test('should not have visual regressions', async ({ page }) => {
        const container = page.locator('#round');

        await expect(container).toHaveScreenshot(screenshot(`chip-round`));
      });
    });

    test.describe('rectangular', () => {
      test('should not have visual regressions', async ({ page }) => {
        const container = page.locator('#rectangular');

        await expect(container).toHaveScreenshot(screenshot(`chip-rectangular`));
      });
    });
  });
});
