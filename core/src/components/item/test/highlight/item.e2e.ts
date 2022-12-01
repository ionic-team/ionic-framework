import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: highlight', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/highlight`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-highlight-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
