import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('card-header: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/card-header/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`card-header-diff-${page.getSnapshotSettings()}.png`);
  });
});
