import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('footer: with tabs', () => {
  test('should not have extra padding when near a tab bar', async ({ page }) => {
    await page.goto('/src/components/footer/test/with-tabs');

    const footer = page.locator('[tab="tab-one"] ion-footer');
    expect(await footer.screenshot()).toMatchSnapshot(`footer-with-tabs-${page.getSnapshotSettings()}.png`);
  });
});
