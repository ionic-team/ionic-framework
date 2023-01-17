import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: custom', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/select/test/legacy/custom`);

    expect(await page.screenshot()).toMatchSnapshot(`select-custom-diff-${page.getSnapshotSettings()}.png`);
  });
});
