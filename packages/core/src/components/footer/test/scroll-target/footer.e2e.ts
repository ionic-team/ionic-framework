import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Translucent effect is only available in iOS mode.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('footer: scroll-target'), () => {
    /**
     * This test suite verifies that the fade effect for iOS is working correctly
     * when the `ion-footer` is using a custom scroll target with the `.ion-content-scroll-host`
     * selector.
     */
    test('should not have visual regressions with custom scroll target footer', async ({ page }) => {
      await page.goto('/src/components/footer/test/scroll-target', config);

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveScreenshot(screenshot(`footer-fade-scroll-target-blurred-diff`));

      const scrollTarget = page.locator('#scroll-target');
      await scrollTarget.evaluate((el: HTMLDivElement) => (el.scrollTop = el.scrollHeight));
      await page.waitForChanges();

      await expect(footer).toHaveScreenshot(screenshot(`footer-fade-scroll-target-not-blurred-diff`));
    });
  });
});
