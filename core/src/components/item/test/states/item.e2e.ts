import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: states', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/states`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-states-diff-${page.getSnapshotSettings()}.png`);
  });
});
