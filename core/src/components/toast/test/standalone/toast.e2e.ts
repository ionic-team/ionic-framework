import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('toast: standalone', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/toast/test/standalone`, config);
    });
    test(title('should not have visual regressions'), async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      const basicButton = page.locator('#basic-toast');
      await basicButton.click();

      await ionToastDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`toast-standalone-${page.getSnapshotSettings()}.png`);
    });
  });
});
