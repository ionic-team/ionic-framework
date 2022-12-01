import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: colors', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/colors`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-colors-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
