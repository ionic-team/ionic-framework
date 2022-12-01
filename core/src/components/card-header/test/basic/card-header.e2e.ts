import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('card-header: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/card-header/test/basic`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`card-header-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
