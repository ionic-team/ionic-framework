import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('range: activeBarStart', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/range/test/activeBarStart`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`range-activeBarStart-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
