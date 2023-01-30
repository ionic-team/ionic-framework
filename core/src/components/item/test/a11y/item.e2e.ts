import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: axe', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/item/test/a11y`);

    const results = await new AxeBuilder({ page })
      // TODO(FW-404): Re-enable rule once select is updated to avoid nested-interactive
      .disableRules('nested-interactive')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should reflect aria-label', async ({ page }) => {
    await page.setContent(`
      <ion-item id="item-1" aria-label="test"></ion-item>
      <ion-item id="item-2" aria-label="test" button="true"></ion-item>
    `);

    const item1 = await page.locator('#item-1 .item-native');
    const item2 = await page.locator('#item-2 .item-native');

    expect(await item1.getAttribute('aria-label')).toEqual('test');
    expect(await item2.getAttribute('aria-label')).toEqual('test');
  });
});
