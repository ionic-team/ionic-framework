import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: reorder', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/reorder`, config);

      await page.setIonViewport();

      await page.click('text=Edit');

      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(`item-reorder-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
