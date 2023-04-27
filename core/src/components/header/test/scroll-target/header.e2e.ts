import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Translucent effect is only available in iOS mode.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: scroll-target'), () => {
    /**
     * This test suite verifies that the fade effect for iOS is working correctly
     * when the `ion-header` is using a custom scroll target with the `.ion-content-scroll-host`
     * selector.
     */
    test('should not have visual regressions with custom scroll target header', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-target', config);

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-scroll-target-not-blurred-diff`));

      const scrollTarget = page.locator('#scroll-target');
      await scrollTarget.evaluate((el: HTMLDivElement) => (el.scrollTop = el.scrollHeight));
      await page.waitForChanges();

      await expect(header).toHaveScreenshot(screenshot(`header-scroll-target-blurred-diff`));
    });
  });
});
