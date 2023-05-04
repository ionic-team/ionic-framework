import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

// TODO FW-3079
/**
 * Reorder group does not have per-mode styles
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.skip(title('reorder group: nested'), () => {
    test.beforeEach(async ({ page, skip }) => {
      skip.browser(
        (browserName: string) => browserName !== 'chromium',
        'dragElementBy is flaky outside of Chrome browsers.'
      );
      await page.goto(`/src/components/reorder-group/test/nested`, config);
    });
    test('should drag and drop when ion-reorder wraps ion-item', async ({ page }) => {
      const items = page.locator('app-reorder');
      const ionItemReorderComplete = await page.spyOnEvent('ionItemReorderComplete');

      await expect(items).toContainText(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

      await dragElementBy(items.nth(1), page, 0, 300);
      await ionItemReorderComplete.next();

      await expect(items).toContainText(['Item 1', 'Item 3', 'Item 4', 'Item 2']);
    });
    test('should drag and drop when ion-item wraps ion-reorder', async ({ page }) => {
      const reorderHandle = page.locator('app-reorder ion-reorder');
      const items = page.locator('app-reorder');
      const ionItemReorderComplete = await page.spyOnEvent('ionItemReorderComplete');

      await expect(items).toContainText(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

      await dragElementBy(reorderHandle.nth(0), page, 0, 300);
      await ionItemReorderComplete.next();

      await expect(items).toContainText(['Item 2', 'Item 3', 'Item 4', 'Item 1']);
    });
  });
});
