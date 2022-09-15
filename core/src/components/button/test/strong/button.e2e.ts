import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: strong', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/strong`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`button-strong-${page.getSnapshotSettings()}.png`);
  });
});
