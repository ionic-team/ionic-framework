import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('back-button: toolbar', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/back-button/test/toolbar`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`back-button-toolbar-${page.getSnapshotSettings()}.png`);
  });
});
