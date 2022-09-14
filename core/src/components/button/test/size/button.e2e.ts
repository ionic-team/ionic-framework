import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: size', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/size`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-size-${page.getSnapshotSettings()}.png`);
  });
});
