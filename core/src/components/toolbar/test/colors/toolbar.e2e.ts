import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toolbar: colors', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toolbar/test/colors`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toolbar-colors-${page.getSnapshotSettings()}.png`);
  });
});
