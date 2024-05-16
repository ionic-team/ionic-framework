import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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
