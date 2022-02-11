import { expect, describe } from '@playwright/test';
import { test } from '@utils/test/utils';

test.describe('button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/basic`);

    expect(await page.screenshot()).toMatchSnapshot(`buton-diff-${page.getSnapshotSettings()}.png`);
  });
})
