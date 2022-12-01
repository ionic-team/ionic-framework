import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: form', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/item/test/form`, config);

      await page.setIonViewport({ resizeViewportWidth: true });

      expect(await page.screenshot()).toMatchSnapshot(`item-form-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
