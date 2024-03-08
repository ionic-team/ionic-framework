import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toast: trigger'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/toast/test/trigger', config);
    });

    test('should open the toast', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const toast = page.locator('#default-toast');

      await page.click('#default');

      await ionToastDidPresent.next();
      await expect(toast).toBeVisible();
    });

    test('should present a previously presented toast', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
      const toast = page.locator('#timeout-toast');

      await page.click('#timeout');

      await ionToastDidDismiss.next();

      await page.click('#timeout');

      await ionToastDidPresent.next();
      await expect(toast).toBeVisible();
    });
  });
});
