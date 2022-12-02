import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe('content: fixed', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/content/test/fixed`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`content-fixed-${page.getSnapshotSettings()}.png`);
    });
  });
});
