import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('list-header: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/list-header/test/basic`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`list-header-${page.getSnapshotSettings()}.png`);
    });
  });
});
