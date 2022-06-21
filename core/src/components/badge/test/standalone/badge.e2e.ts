import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('badge: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/badge/test/standalone');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`badge-standalone-${page.getSnapshotSettings()}.png`);
  });
});
