import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('card: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/card/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`card-diff-${page.getSnapshotSettings()}.png`);
  });
});
