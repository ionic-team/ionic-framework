import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: indeterminate (legacy)', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/checkbox/test/legacy/indeterminate`);

    const content = page.locator('#checkboxes');
    expect(await content.screenshot()).toMatchSnapshot(
      `checkbox-legacy-indeterminate-${page.getSnapshotSettings()}.png`
    );
  });
});
