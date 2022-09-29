import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: inset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/list/test/inset');
  });
  test.describe('list: visual regression tests', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`list-inset-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
