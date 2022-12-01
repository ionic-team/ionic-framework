import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('action sheet: translucent', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/translucent`, config);

      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      const basic = page.locator('#basic');
      await basic.click();

      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      expect(await actionSheet.screenshot()).toMatchSnapshot(
        `action-sheet-translucent-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
