import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toolbar: colors', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toolbar/test/colors`);

    // only capture the container to avoid extra white space
    const container = page.locator('#toolbars');
    expect(await container.screenshot()).toMatchSnapshot(`toolbar-colors-${page.getSnapshotSettings()}.png`);
  });
});
