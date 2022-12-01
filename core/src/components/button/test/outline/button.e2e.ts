import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('button: outline', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/button/test/outline`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`button-outline-${page.getSnapshotSettings()}.png`);
    });
  });
});
