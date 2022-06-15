import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: groups', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/groups`);

    // Since the list is dynamically created, we need to wait for it to be rendered
    await page.waitForChanges();

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-groups-diff-${page.getSnapshotSettings()}.png`);
  });
});
