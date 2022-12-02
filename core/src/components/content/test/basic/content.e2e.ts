import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('content: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/content/test/basic`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`content-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
