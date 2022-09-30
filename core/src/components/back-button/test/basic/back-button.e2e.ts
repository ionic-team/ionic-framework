import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('back-button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/back-button/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`back-button-basic-${page.getSnapshotSettings()}.png`);
  });
});
