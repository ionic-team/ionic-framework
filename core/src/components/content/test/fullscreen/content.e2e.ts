import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('content: fullscreen', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/content/test/fullscreen`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`content-fullscreen-${page.getSnapshotSettings()}.png`);
    });
  });
});
