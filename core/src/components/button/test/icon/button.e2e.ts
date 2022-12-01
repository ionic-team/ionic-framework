import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('button: icon', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/button/test/icon`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`button-icon-${page.getSnapshotSettings()}.png`);
    });
  });
});
