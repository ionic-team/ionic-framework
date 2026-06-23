import { configs, test } from '@utils/test/playwright';

import { ActionSheetFixture } from '../basic/fixture';

/**
 * This behavior does not vary across  directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('action sheet: states'), () => {
    /**
     * `(any-hover: hover)` evaluates to "none" in all three mobile-emulated
     * projects, suppressing the hover rules:
     *
     * - Chromium and WebKit suppress it because of hasTouch and isMobile.
     * - Headless Firefox doesn't detect input devices and reports no hover
     *   capability regardless of context options, so override it via
     *   launchOptions.firefoxUserPrefs. Bit values: 4 = FINE (mouse),
     *   8 = HOVER, 12 = FINE | HOVER.
     *
     * Viewport, userAgent, and scale factor remain mobile-sized.
     */
    test.use({
      hasTouch: false,
      isMobile: false,
    });

    test('should render all button states', async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/states`, config);

      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#basic');

      const defaultButton = page.locator('ion-action-sheet button.action-sheet-button').first();
      await defaultButton.hover();

      await actionSheetFixture.screenshot('states');
    });
  });
});
