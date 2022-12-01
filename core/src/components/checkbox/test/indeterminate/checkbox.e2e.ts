import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('checkbox: indeterminate', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/checkbox/test/indeterminate`, config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`checkbox-indeterminate-${page.getSnapshotSettings()}.png`);
    });
  });
});
