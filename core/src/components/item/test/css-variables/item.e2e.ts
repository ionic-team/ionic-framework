import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: CSS variables', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/css-variables`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-css-vars-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
