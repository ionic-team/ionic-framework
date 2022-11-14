import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('title: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/title/test/basic');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`title-basic-${page.getSnapshotSettings()}.png`);
  });
});
