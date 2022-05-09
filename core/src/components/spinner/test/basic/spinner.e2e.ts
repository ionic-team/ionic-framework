import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('spinner: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/spinner/test/basic');
  });
  test.describe('spinner: visual regression tests', () => {
    test('should open a basic loader', async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`spinner-basic-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
