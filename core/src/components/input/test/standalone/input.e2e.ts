import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: standalone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/standalone');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`input-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});
