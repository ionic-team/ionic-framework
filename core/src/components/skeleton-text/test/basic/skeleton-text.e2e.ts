import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('skeleton-text: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/skeleton-text/test/basic', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`skeleton-text-basic-${page.getSnapshotSettings()}.png`);
    });
  });
});
