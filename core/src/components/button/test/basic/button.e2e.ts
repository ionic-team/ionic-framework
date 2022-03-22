mport { expect, describe } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/basic`);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-diff-${page.getSnapshotSettings()}.png`);
  });
});
