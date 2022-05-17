import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/range/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`range-diff-${page.getSnapshotSettings()}.png`);
  });
});
