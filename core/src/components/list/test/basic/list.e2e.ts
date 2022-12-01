import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('list: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/list/test/basic`, config);

      const list = page.locator('ion-list');

      expect(await list.screenshot()).toMatchSnapshot(`list-basic-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
