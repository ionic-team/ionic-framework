import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Translucency is only available on ios mode
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('fab: translucent'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/fab/test/translucent`, config);

      const fab = page.locator('#fab5');
      await fab.click();
      await page.waitForChanges();

      /**
       * fab.screenshot doesn't work since ion-fab's bounding box only covers the
       * central button. This viewport size crops extra white space while also
       * containing all the buttons in the open fab.
       */
      await page.setViewportSize({
        width: 235,
        height: 310,
      });

      await expect(page).toHaveScreenshot(screenshot(`fab-translucent`));
    });
  });
});
