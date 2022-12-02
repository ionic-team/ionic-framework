import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('spinner: color', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/spinner/test/color', config);
    });
    test.describe('spinner: visual regression tests', () => {
      test(title('should not have visual regressions'), async ({ page }) => {
        await page.setIonViewport();

        expect(await page.screenshot()).toMatchSnapshot(`spinner-color-diff-${page.getSnapshotSettings()}.png`);
      });
    });
  });
});
