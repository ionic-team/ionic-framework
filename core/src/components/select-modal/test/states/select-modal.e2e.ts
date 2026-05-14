import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select-modal: states'), () => {
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

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/select-modal/test/states`, config);
    });

    test('should render all radio states', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      await page.locator('#single').click();
      await ionModalDidPresent.next();

      const modal = page.locator('#modal-single');
      const selectModal = modal.locator('ion-select-modal');
      await expect(selectModal).toBeVisible();

      /**
       * After clicking the trigger button, the cursor sits at the
       * button's screen coordinates — which may coincide with the
       * "Default" row once the modal opens, depending on mode/viewport.
       * Without a transition, `mouseenter` doesn't fire and the JS-driven
       * label swap never runs, causing inconsistent hover states in the
       * screenshots.
       */
      await page.mouse.move(0, 0);

      const defaultRow = selectModal.locator('ion-item').first();
      await defaultRow.hover();

      await expect(selectModal).toHaveScreenshot(screenshot('select-modal-radio-states'));
    });

    test('should render all checkbox states', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      await page.locator('#multiple').click();
      await ionModalDidPresent.next();

      const modal = page.locator('#modal-multiple');
      const selectModal = modal.locator('ion-select-modal');
      await expect(selectModal).toBeVisible();

      /**
       * After clicking the trigger button, the cursor sits at the
       * button's screen coordinates — which may coincide with the
       * "Default" row once the modal opens, depending on mode/viewport.
       * Without a transition, `mouseenter` doesn't fire and the JS-driven
       * label swap never runs, causing inconsistent hover states in the
       * screenshots.
       */
      await page.mouse.move(0, 0);

      const defaultRow = selectModal.locator('ion-item').first();
      await defaultRow.hover();

      await expect(selectModal).toHaveScreenshot(screenshot('select-modal-checkbox-states'));
    });
  });
});
