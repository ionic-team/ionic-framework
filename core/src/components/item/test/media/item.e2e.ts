import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: media', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/media`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-media-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
