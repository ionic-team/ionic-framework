import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('list: inset', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/list/test/inset', config);
    });
    test.describe('list: visual regression tests', () => {
      test(title('should not have visual regressions'), async ({ page }) => {
        await page.setIonViewport();

        expect(await page.screenshot()).toMatchSnapshot(`list-inset-diff-${page.getSnapshotSettings()}.png`);
      });
    });
  });
});
