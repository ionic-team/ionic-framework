import { expect } from '@playwright/test';
import { test, dragElementBy } from '@utils/test/playwright';

// TODO FW-3079
test.describe.skip('reorder group: scroll-target', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Reorder group does not have per-mode styles');
    skip.browser(
      (browserName: string) => browserName !== 'chromium',
      'dragElementBy is flaky outside of Chrome browsers.'
    );
  });
  test('should drag and drop when ion-reorder wraps ion-item', async ({ page }) => {
    await page.goto(`/src/components/reorder-group/test/scroll-target`);

    const items = page.locator('ion-item');
    const ionItemReorderComplete = await page.spyOnEvent('ionItemReorderComplete');

    await expect(items).toContainText(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

    await dragElementBy(items.nth(1), page, 0, 300);
    await ionItemReorderComplete.next();

    await expect(items).toContainText(['Item 1', 'Item 3', 'Item 4', 'Item 2']);
  });
  test('should drag and drop when ion-item wraps ion-reorder', async ({ page }) => {
    await page.goto(`/src/components/reorder-group/test/scroll-target`);

    const reorderHandle = page.locator('ion-reorder');
    const items = page.locator('ion-item');
    const ionItemReorderComplete = await page.spyOnEvent('ionItemReorderComplete');

    await expect(items).toContainText(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

    await dragElementBy(reorderHandle.nth(0), page, 0, 300);
    await ionItemReorderComplete.next();

    await expect(items).toContainText(['Item 2', 'Item 3', 'Item 4', 'Item 1']);
  });
});
