import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: collapsed', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/breadcrumbs/test/collapsed`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`breadcrumb-collapsed-diff-${page.getSnapshotSettings()}.png`);
  });
});
