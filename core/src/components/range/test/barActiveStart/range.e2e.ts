import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: barActiveStart', () => {

  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/barActiveStart`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`range-barActiveStart-diff-${page.getSnapshotSettings()}.png`);
  });
});
