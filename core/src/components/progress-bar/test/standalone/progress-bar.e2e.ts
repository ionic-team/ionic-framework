import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('progress-bar: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/progress-bar/test/standalone');

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `progress-bar-standalone-${page.getSnapshotSettings()}.png`
    );
  });
});
