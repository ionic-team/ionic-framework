import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('action sheet: translucent'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/translucent`, config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      const basic = page.locator('#basic');
      await basic.click();

      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      await expect(actionSheet).toHaveScreenshot(screenshot('action-sheet-translucent'));
    });
  });
});
