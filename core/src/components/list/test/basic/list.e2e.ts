import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/list/test/basic`);

    const list = page.locator('ion-list');

    expect(await list.screenshot()).toMatchSnapshot(`list-basic-diff-${page.getSnapshotSettings()}.png`);
  });
});
