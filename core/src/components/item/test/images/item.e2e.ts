import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: images', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/images`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-images-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
