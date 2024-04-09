import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Shape is only available in the Ionic theme.
 * TODO(FW-6119): add the `ios` and `md` modes when shape support is added.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: shape'), () => {
    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/card/test/shape`, config);

        await page.setIonViewport();

        const container = page.locator('#default');

        await expect(container).toHaveScreenshot(screenshot(`card-default`));
      });
    });

    test.describe('round', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/card/test/shape`, config);

        await page.setIonViewport();

        const container = page.locator('#round');

        await expect(container).toHaveScreenshot(screenshot(`card-round`));
      });
    });

    test.describe('rectangular', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/card/test/shape`, config);

        await page.setIonViewport();

        const container = page.locator('#rectangular');

        await expect(container).toHaveScreenshot(screenshot(`card-rectangular`));
      });
    });
  });
});
