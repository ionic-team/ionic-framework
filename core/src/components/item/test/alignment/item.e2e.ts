import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: alignment', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/alignment`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-alignment-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
