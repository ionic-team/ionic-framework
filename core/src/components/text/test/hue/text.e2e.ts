import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('text: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/text/test/hue`, config);
    });

    HUES.forEach((hue) => {
      test(`should render ${hue} text`, async ({ page }) => {
        const text = page.locator(`#${hue}`);
        await expect(text).toHaveScreenshot(screenshot(`text-hue-${hue}`));
      });
    });
  });
});
