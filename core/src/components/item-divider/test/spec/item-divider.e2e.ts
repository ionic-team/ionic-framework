import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item-divider: spec', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/item-divider/test/spec', config);
    });

    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`list-item-divider-${page.getSnapshotSettings()}.png`);
    });
  });
});
