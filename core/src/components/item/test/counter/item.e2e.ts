import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: counter', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/counter`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-counter-diff-${page.getSnapshotSettings()}.png`);
  });
});
