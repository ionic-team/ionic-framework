import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('segment: custom', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/segment/test/custom', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`segment-custom-${page.getSnapshotSettings()}.png`);
    });
  });
});
