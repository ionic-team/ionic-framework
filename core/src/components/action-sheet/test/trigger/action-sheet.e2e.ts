import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('action sheet: trigger', () => {
  configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ config, title }) => {
    test(title('should open the action sheet'), async ({ page }) => {
      await page.goto('/src/components/action-sheet/test/trigger', config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const actionSheet = page.locator('#default-action-sheet');

      await page.click('#default');

      await ionActionSheetDidPresent.next();
      await expect(actionSheet).toBeVisible();
    });

    test(title('should present a previously presented action sheet'), async ({ page }) => {
      await page.goto('/src/components/action-sheet/test/trigger', config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');
      const actionSheet = page.locator('#timeout-action-sheet');

      await page.click('#timeout');

      await ionActionSheetDidDismiss.next();

      await page.click('#timeout');

      await ionActionSheetDidPresent.next();
      await expect(actionSheet).toBeVisible();
    });
  });
});
