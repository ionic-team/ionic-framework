import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: label', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/select/test/label`);

    expect(await page.screenshot()).toMatchSnapshot(`select-label-diff-${page.getSnapshotSettings()}.png`);
  });
});
