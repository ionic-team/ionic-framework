import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageDoesNotExist, withTestingMode } from './utils/test-utils';

test.describe('Navigate Root', () => {
  test('clears navigation stack and unmounts previous views', async ({ page }) => {
    await page.goto(withTestingMode('/navigate-root/page-a'));
    await ionPageVisible(page, 'navigate-root-page-a');
    await expect(page.locator('#page-a-can-go-back')).toHaveText('no');

    // 1. Push to page B, then page C to build up history
    await page.locator('#go-to-page-b').click();
    await ionPageVisible(page, 'navigate-root-page-b');

    await page.locator('#go-to-page-c').click();
    await ionPageVisible(page, 'navigate-root-page-c');
    await expect(page.locator('#page-c-can-go-back')).toHaveText('yes');

    // 2. Navigate root — should clear stack and unmount previous views
    await page.locator('#navigate-root-to-page-a').click();
    await ionPageVisible(page, 'navigate-root-page-a');
    await expect(page).toHaveURL(/\/navigate-root\/page-a/);
    await ionPageDoesNotExist(page, 'navigate-root-page-b');
    await ionPageDoesNotExist(page, 'navigate-root-page-c');
    await expect(page.locator('#page-a-can-go-back')).toHaveText('no');
  });
});
