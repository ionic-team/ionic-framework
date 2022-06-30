import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});
