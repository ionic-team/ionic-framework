import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

/**
 * This behavior does not vary across directions.
 *
 * `ios` is the same as `md`.
 */
configs({
  directions: ['ltr'],
  modes: ['md', 'ionic-md'],
  palettes: ['light', 'dark', 'high-contrast', 'high-contrast-dark'],
}).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: hue'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/title/test/hue', config);
    });

    HUES.forEach((hue) => {
      test(`should render ${hue} titles`, async ({ page }) => {
        const titles = page.locator(`#${hue}`);

        await expect(titles).toHaveScreenshot(screenshot(`title-hue-${hue}`));
      });
    });
  });
});
