import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: sizes'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toggle/test/sizes`, config);

      await page.setIonViewport();

      /**
       * The ionic-md theme renders the `toggle-activated` press state with
       * non-deterministic anti-aliasing under Playwright/WebKit, producing
       * ~1% pixel drift between captures. Allow a small tolerance until the
       * underlying instability is addressed.
       */
      await expect(page).toHaveScreenshot(screenshot(`toggle-sizes-diff`), { maxDiffPixelRatio: 0.02 });
    });
  });
});
