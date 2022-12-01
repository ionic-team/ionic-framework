import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('content: standalone', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/content/test/standalone`, config);

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `content-standalone-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
