import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('spinner: basic', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/spinner/test/basic', config);
    });
    test.describe('spinner: visual regression tests', () => {
      test(title('should not have visual regressions'), async ({ page }) => {
        await page.setIonViewport();

        expect(await page.screenshot()).toMatchSnapshot(`spinner-basic-diff-${page.getSnapshotSettings()}.png`);
      });
    });
  });
});
