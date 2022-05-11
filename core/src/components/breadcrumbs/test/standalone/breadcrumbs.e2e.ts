import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/breadcrumbs/test/standalone`);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `breadcrumb-standalone-diff-${page.getSnapshotSettings()}.png`
    );
  });
});
