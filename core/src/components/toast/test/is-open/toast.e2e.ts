import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toast: isOpen'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/toast/test/is-open', config);
    });

    test('should open the toast', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const toast = page.locator('ion-toast');

      await page.click('#default');

      await ionToastDidPresent.next();
      await expect(toast).toBeVisible();
    });

    test('should open the toast then close after a timeout', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
      const toast = page.locator('ion-toast');

      await page.click('#timeout');

      await ionToastDidPresent.next();
      await expect(toast).toBeVisible();

      await ionToastDidDismiss.next();
      await expect(toast).toBeHidden();
    });
  });
});
