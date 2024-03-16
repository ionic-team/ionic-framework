import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toast: isOpen'), () => {
    test('should open and close the toast', async ({ page }) => {
      await page.goto('/src/components/toast/test/is-open', config);

      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const toast = page.locator('ion-toast');

      await page.click('#default');

      await ionToastDidPresent.next();
      await expect(toast).toBeVisible();

      await toast.evaluate((el: HTMLIonToastElement) => (el.isOpen = false));

      await ionToastDidDismiss.next();
      await expect(toast).toBeHidden();
    });

    test('should open if isOpen is true on load', async ({ page }) => {
      await page.setContent('<ion-toast is-open="true"></ion-toast>', config);
      await expect(page.locator('ion-toast')).toBeVisible();
    });
  });
});
