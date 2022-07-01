import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: dividers', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/dividers`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-dividers-diff-${page.getSnapshotSettings()}.png`);
  });
});
