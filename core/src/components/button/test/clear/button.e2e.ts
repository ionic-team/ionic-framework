import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: clear', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/clear`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-clear-${page.getSnapshotSettings()}.png`);
  });
});
