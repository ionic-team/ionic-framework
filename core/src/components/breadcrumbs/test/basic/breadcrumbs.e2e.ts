import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/breadcrumbs/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`breadcrumb-diff-${page.getSnapshotSettings()}.png`);
  });
});
