import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('searchbar: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/searchbar/test/standalone`);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `searchbar-standalone-${page.getSnapshotSettings()}.png`
    );
  });
});
