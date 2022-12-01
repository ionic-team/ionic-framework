import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('breadcrumbs: collapsed', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/breadcrumbs/test/collapsed`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`breadcrumb-collapsed-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
