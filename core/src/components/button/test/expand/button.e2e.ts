import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: expand', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/expand`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`button-expand-${page.getSnapshotSettings()}.png`);
  });
});
