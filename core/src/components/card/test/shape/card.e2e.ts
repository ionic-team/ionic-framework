import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Shape is only available in the Ionic theme.
 */

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: Shape'), () => {
    test('Shape Default: should not have visual regressions with basic card', async ({ page }) => {

      await page.goto(`/src/components/card/test/shape`, config);

      await page.setIonViewport();

      const container = page.locator('#default');

      await expect(container).toHaveScreenshot(screenshot(`card-default`));
    });

    test('Shape round: should not have visual regressions with basic card', async ({ page }) => {

      await page.goto(`/src/components/card/test/shape`, config);

      await page.setIonViewport();

      const container = page.locator('#round');

      await expect(container).toHaveScreenshot(screenshot(`card-round`));
    });

    test('Shape rectangular: should not have visual regressions with basic card', async ({ page }) => {

      await page.goto(`/src/components/card/test/shape`, config);

      await page.setIonViewport();

      const container = page.locator('#rectangular');

      await expect(container).toHaveScreenshot(screenshot(`card-rectangular`));
    });
  });
});
