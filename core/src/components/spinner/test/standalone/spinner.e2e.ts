import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('spinner: standalone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/spinner/test/standalone');
  });
  test.describe('spinner: visual regression tests', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`spinner-standalone-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
