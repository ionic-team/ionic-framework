import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/spec');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`input-spec-diff-${page.getSnapshotSettings()}.png`);
  });
});
