import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('progress-bar: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/progress-bar/test/basic', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`progress-bar-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
