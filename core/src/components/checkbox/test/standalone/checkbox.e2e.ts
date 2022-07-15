import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/checkbox/test/standalone`);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `checkbox-standalone-${page.getSnapshotSettings()}.png`
    );
  });
});
