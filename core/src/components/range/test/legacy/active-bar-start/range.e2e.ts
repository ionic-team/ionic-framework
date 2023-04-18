import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: activeBarStart', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/legacy/active-bar-start`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`range-activeBarStart-diff-${page.getSnapshotSettings()}.png`);
  });
});
