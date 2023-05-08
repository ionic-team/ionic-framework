import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: isOpen'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/is-open', config);
    });

    test('should open the modal', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#default');

      await ionModalDidPresent.next();
      await expect(modal).toBeVisible();
    });

    test('should open the modal then close after a timeout', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const modal = page.locator('ion-modal');

      await page.click('#timeout');

      await ionModalDidPresent.next();
      await expect(modal).toBeVisible();

      await ionModalDidDismiss.next();
      await expect(modal).toBeHidden();
    });
  });
});
