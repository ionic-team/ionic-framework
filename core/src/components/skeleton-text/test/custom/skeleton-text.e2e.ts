import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('skeleton-text: custom', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/skeleton-text/test/custom');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`skeleton-text-custom-${page.getSnapshotSettings()}.png`);
  });
});
