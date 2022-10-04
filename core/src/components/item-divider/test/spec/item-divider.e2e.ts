import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-divider: spec', () => {

  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/item-divider/test/spec');

    const list = await page.locator('ion-list');

    expect(await list.screenshot()).toMatchSnapshot(
      `list-item-divider-${page.getSnapshotSettings()}.png`
    );
  });
});

