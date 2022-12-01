import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: fill', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/fill`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-fill-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
