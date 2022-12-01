import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('badge: rendering', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/badge/test/basic', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`badge-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
