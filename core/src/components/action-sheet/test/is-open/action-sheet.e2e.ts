import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('action sheet: isOpen', () => {
  configs({ direction: ['ltr'], mode: ['ios'] }).forEach(({ config, title }) => {
    test(title('should open the action sheet'), async ({ page }) => {
      await page.goto('/src/components/action-sheet/test/isOpen', config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const actionSheet = page.locator('ion-action-sheet');

      await page.click('#default');

      await ionActionSheetDidPresent.next();
      await expect(actionSheet).toBeVisible();
    });

    test(title('should open the action sheet then close after a timeout'), async ({ page }) => {
      await page.goto('/src/components/action-sheet/test/isOpen', config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');
      const actionSheet = page.locator('ion-action-sheet');

      await page.click('#timeout');

      await ionActionSheetDidPresent.next();
      await expect(actionSheet).toBeVisible();

      await ionActionSheetDidDismiss.next();

      await expect(actionSheet).toBeHidden();
    });
  });
});
