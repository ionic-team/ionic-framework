import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list-header: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/list-header/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`list-header-${page.getSnapshotSettings()}.png`);
  });
});
