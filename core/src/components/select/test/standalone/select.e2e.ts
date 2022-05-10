import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/select/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`select-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});
