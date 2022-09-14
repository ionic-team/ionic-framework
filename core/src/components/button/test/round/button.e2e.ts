import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: round', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/round`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-round-${page.getSnapshotSettings()}.png`);
  });
});
